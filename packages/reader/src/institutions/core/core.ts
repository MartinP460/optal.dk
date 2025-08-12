import slugify from 'slugify'
import path from 'path'
import { readCSV } from '../../utils/readCSV'
import { AVAILABLE_YEARS, KOT_CATEGORY_UNITS } from '../../constants'
import { KOTCategory, KOTDataCategories, KOTInstitutionPartial, KOTSubcategory } from '../../types'
import { convertToNumber } from '../../utils/convertToNumber'
import { cities } from '../../utils/cities'

const FILEPATH = 'data/core'

enum CSVDataIndexes {
  CourseId = 0, // (string) id of the course
  InstitutionId = 1, // (string) id of the institution
  Name = 2, // (string) name of the course or institution
  AdmittedDirect = 3, // (integer) number of people admitted
  AdmittedStandby = 4, // (integer) number of people put on standby
  AppliedTotal = 5, // (integer) number of people who applied
  AppliedFirstPriority = 6, // (integer) number of people who applied with course as their first priority
  QuotientPrimary = 7, // (float, string or null) quotient (average grade)
  QuotientStandby = 8 // (float, string or null) quotient (average grade) for people put on standby
}

export async function readCoreData() {
  let institutions: KOTInstitutionPartial[] = []

  const dataSheets = await Promise.all(
    AVAILABLE_YEARS.map((year) => {
      const filePath = path.resolve(`${FILEPATH}/${year}.csv`)
      return readCSV(filePath)
    })
  )

  dataSheets.forEach((dataSheet, i) => {
    institutions = readDataSheet(dataSheet, institutions, AVAILABLE_YEARS[i])
  })

  return institutions
}

function readDataSheet(dataSheet: string[][], institutions: KOTInstitutionPartial[], year: number) {
  let newInstitutions = institutions

  const cleanedDataSheet = trimData(dataSheet)

  cleanedDataSheet.forEach((row) => {
    if (isRowInstitutionHeader(row)) {
      newInstitutions = upsertInstitution(row, newInstitutions)
    }
    if (isRowCourse(row)) {
      newInstitutions = upsertCourse(row, newInstitutions, year)
    }
    if (isRowInstitutionSummary(row)) {
      newInstitutions = upsertInstitutionData(row, newInstitutions, year)
    }
  })

  return newInstitutions
}

function isRowInstitutionHeader(row: string[]) {
  return (
    row[CSVDataIndexes.CourseId] === '' &&
    row[CSVDataIndexes.InstitutionId] !== '' &&
    row[CSVDataIndexes.AdmittedDirect] === ''
  )
}

function isRowCourse(row: string[]) {
  return (
    row[CSVDataIndexes.CourseId] !== '' &&
    (row[CSVDataIndexes.AdmittedDirect] !== '' || row[CSVDataIndexes.AppliedTotal] !== '')
  )
}

function isRowInstitutionSummary(row: string[]) {
  return (
    row[CSVDataIndexes.CourseId] === '' &&
    row[CSVDataIndexes.InstitutionId] !== '' &&
    row[CSVDataIndexes.AdmittedDirect] !== ''
  )
}

function upsertInstitution(
  row: string[],
  institutions: KOTInstitutionPartial[]
): KOTInstitutionPartial[] {
  const institutionId = row[CSVDataIndexes.InstitutionId]
  const institutionName = row[CSVDataIndexes.Name]

  const institution = institutions.find((inst) => inst.id === institutionId)

  if (!institution) {
    // console.log(`Institution: ${institutionName}`)

    return [
      {
        id: institutionId,
        institutionNames: [institutionName],
        courses: [],
        latestName: institutionName,
        slug: createSlug(institutionName),
        dataCategories: {},
        period: [0]
      },
      ...institutions
    ]
  } else {
    const filteredInstitutions = institutions.filter((inst) => inst.id !== institution.id)

    const newInstitutionNames = institution.institutionNames.includes(institutionName)
      ? institution.institutionNames
      : [...institution.institutionNames, institutionName]

    return [
      {
        ...institution,
        institutionNames: newInstitutionNames,
        latestName: institutionName,
        slug: createSlug(institutionName)
      },
      ...filteredInstitutions
    ]
  }
}

function upsertCourse(
  row: string[],
  institutions: KOTInstitutionPartial[],
  year: number
): KOTInstitutionPartial[] {
  const courseId = row[CSVDataIndexes.CourseId]
  const courseName = row[CSVDataIndexes.Name]
  const institutionId = row[CSVDataIndexes.InstitutionId]

  const institution = institutions.find((inst) => inst.id === institutionId)

  if (!institution)
    throw new Error(`No institution with ID: ${institutionId} for course: ${courseName}.`)

  const course = institution.courses.find((crs) => crs.id === courseId)

  const filteredInstitutions = institutions.filter((inst) => inst.id !== institution.id)
  const filteredCourses = institution.courses.filter((course) => course.id !== courseId)

  const newCourseNames = course?.courseNames.includes(courseName)
    ? course.courseNames
    : [...(course?.courseNames ?? []), courseName]

  const additionalData = parseCourseName(courseId, courseName)
  const newDataCategories = addDataCategories(row, course?.dataCategories ?? {}, year, [
    KOTCategory.Accepted,
    KOTCategory.Applied,
    KOTCategory.Quotient
  ])
  const period = createPeriod(newDataCategories)

  return [
    ...filteredInstitutions,
    {
      ...institution,
      courses: [
        ...filteredCourses,
        {
          id: courseId,
          courseNames: newCourseNames,
          dataCategories: newDataCategories,
          period,
          ...additionalData
        }
      ]
    }
  ]
}

function upsertInstitutionData(
  row: string[],
  institutions: KOTInstitutionPartial[],
  year: number
): KOTInstitutionPartial[] {
  const institutionId = row[CSVDataIndexes.InstitutionId]

  const institution = institutions.find((inst) => inst.id === institutionId)

  if (!institution)
    throw new Error(`No institution with ID: ${institutionId} found to insert institution data.`)

  const filteredInstitutions = institutions.filter((inst) => inst.id !== institution.id)

  const newDataCategories = addDataCategories(row, institution.dataCategories, year, [
    KOTCategory.Accepted,
    KOTCategory.Applied
  ])
  const period = createPeriod(newDataCategories)

  return [
    ...filteredInstitutions,
    {
      ...institution,
      dataCategories: addDataCategories(row, institution.dataCategories, year, [
        KOTCategory.Accepted,
        KOTCategory.Applied
      ]),
      period
    }
  ]
}

function addDataCategories(
  row: string[],
  dataCategories: KOTDataCategories,
  year: number,
  categories: KOTCategory[]
): KOTDataCategories {
  return Object.fromEntries(
    categories.map((category) => [
      category,
      {
        name: category,
        unit: KOT_CATEGORY_UNITS[category],
        datasets: [
          ...(dataCategories[category]?.datasets ?? []),
          {
            year,
            ...getDatapointsFromCategory(row, category)
          }
        ]
      }
    ])
  )
}

function getDatapointsFromCategory(
  row: string[],
  category: KOTCategory
): {
  [key in KOTSubcategory]?: number | string
} {
  switch (category) {
    case KOTCategory.Accepted:
      return {
        acceptedAdmitted: convertToNumber(row[CSVDataIndexes.AdmittedDirect]),
        acceptedStandby: convertToNumber(row[CSVDataIndexes.AdmittedStandby])
      }
    case KOTCategory.Applied:
      return {
        appliedTotal: convertToNumber(row[CSVDataIndexes.AppliedTotal]),
        appliedFirstpriority: convertToNumber(row[CSVDataIndexes.AppliedFirstPriority])
      }
    case KOTCategory.Quotient:
      return {
        quotientPrimary: row[CSVDataIndexes.QuotientPrimary],
        quotientStandby: row[CSVDataIndexes.QuotientStandby]
      }
    default:
      throw new Error(`Unknown category: ${category}`)
  }
}

/** Trims data and replaces all - (dash signs) with 0's. */
function trimData(data: string[][]) {
  return data.map((row) =>
    row.map((item) => {
      const trimmedItem = item.trim()

      if (trimmedItem === '-') {
        return trimmedItem.replace('-', '0')
      }
      return trimmedItem
    })
  )
}

/** Parses course names to extract or create the core name, meta-information and slug from the name. */
function parseCourseName(courseId: string, latestName: string) {
  const newLatestName = replaceCourseMetaInParentheses(latestName)
  const parts = newLatestName.split(', ')

  const indexOfLocation = parts.findIndex((part) => cities.includes(part.toLowerCase()))

  if (indexOfLocation === -1) {
    return {
      latestName: newLatestName,
      studyStart: null,
      eLearning: null,
      location: null,
      slug: courseId
    }
  }

  const name = parts.slice(0, indexOfLocation).join(', ')
  const meta = transformMetaData(parts.slice(indexOfLocation))
  const slug = createSlug(`${name}-${courseId}`)

  return {
    latestName: name,
    slug,
    ...meta
  }
}

/** Creates a "slug" from the name of an institution or course. */
function createSlug(name: string) {
  // replaces the characters / and , with -
  const additionallyTransformedName = `${name.replaceAll(/[/,]/g, '-')}`

  return slugify(additionallyTransformedName, {
    replacement: '-',
    remove: /[*+~./()'"!:@]/g,
    lower: true
  })
}

/** Transforms an item in the array of meta-data into a standarized format. */
function transformMetaData(metaData: string[]) {
  let studyStart = null
  let eLearning = false
  let location = null

  metaData.forEach((metaItem) => {
    const item = metaItem.toLowerCase()

    if (item.includes('sommer') || item.includes('summer')) {
      studyStart = 'summerstart'
      return
    }
    if (item.includes('vinter') || item.includes('winter')) {
      studyStart = 'winterstart'
      return
    }
    if (item.includes('e-læring') || item.includes('e-learning')) {
      eLearning = true
      return
    }
    if (cities.includes(item)) {
      location = metaItem
      return
    }
  })

  return { studyStart, eLearning, location }
}

/** Replaces any course meta data wrapped in parenthes with commas, e.g. "...Ballerup (winter)" with "...Ballerup, winter" */
function replaceCourseMetaInParentheses(str: string) {
  return str
    .replace(' (sommer)', ', sommer')
    .replace(' (vinter)', ', vinter')
    .replace(' (summer)', ', summer')
    .replace(' (winter)', ', winter')
}

/** Creates the time period in which the course is active. */
function createPeriod(dataCategories: KOTDataCategories) {
  // We pick the accepted category since it will always be defined
  const min = dataCategories?.accepted?.datasets[0].year ?? 0
  const max = dataCategories?.accepted?.datasets.slice(-1)[0].year ?? 0

  return min === max ? [min] : [min, max]
}
