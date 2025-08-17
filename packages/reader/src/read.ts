import slugify from 'slugify'
import _ from 'lodash'
import Papa from 'papaparse'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'
import {
  KOTDataPointKeys as K,
  KOTCourse,
  KOTData,
  KOTDataType,
  KOTDataTypes,
  KOTInstitution,
  KOTInstitutionCourses
} from './newTypes'

/** Reads and returns KOT data across all available years. */
export async function readData() {
  let institutions: KOTInstitution[] = []
  let courses: KOTCourse[] = []
  let institutionCourses: KOTInstitutionCourses[] = []
  let data: KOTData[] = []

  const dataSheets = await Promise.all(
    AVAILABLE_YEARS.map((year) => {
      const filePath = path.resolve(`${FILEPATH}/${year}.csv`)
      return readCSV(filePath)
    })
  )

  dataSheets.forEach((dataSheet, i) => {
    const year = AVAILABLE_YEARS[i]
    const cleanedDataSheet = trimData(dataSheet)

    cleanedDataSheet.forEach((row) => {
      if (isRowInstitutionHeader(row)) {
        institutions = upsertInstitution(institutions, row, year)
      }
      if (isRowCourse(row)) {
        courses = upsertCourse(courses, row, year)
        institutionCourses = upsertInstitutionCourses(institutionCourses, row, year)
        data = upsertCourseData(data, row, year)
      }
      if (isRowInstitutionSummary(row)) {
        data = upsertInstitutionData(data, institutionCourses, row, year)
      }
    })
  })

  institutions = institutions.sort((a, b) => a.latestName.localeCompare(b.latestName, 'en'))
  courses = courses.sort((a, b) => a.latestName.localeCompare(b.latestName, 'en'))

  return {
    institutions,
    courses,
    institutionCourses,
    data
  }
}

/** Upserts a `KOTInstitution` object in the array of `KOTInstitution`. */
function upsertInstitution(
  institutions: KOTInstitution[],
  row: string[],
  year: number
): KOTInstitution[] {
  const KOTId = row[CSV_INDICES.institutionId]
  const latestName = row[CSV_INDICES.name]

  const institution = institutions.find((inst) => inst.KOTId === KOTId)

  const id = randomUUID()
  const institutionNames = institution?.institutionNames.includes(latestName)
    ? institution.institutionNames
    : [...(institution?.institutionNames ?? []), latestName]
  const slug = createSlug(latestName)
  const period: [number, number] = institution ? [institution.period[0], year] : [year, year]

  const newInstitution = {
    id,
    KOTId,
    institutionNames,
    latestName,
    slug,
    period
  }

  return [
    ...(institution ? institutions.filter((inst) => inst.KOTId !== KOTId) : institutions),
    newInstitution
  ]
}

/** Upserts a `KOTCourse` object in the array of `KOTCourse`. */
function upsertCourse(courses: KOTCourse[], row: string[], year: number): KOTCourse[] {
  const KOTId = row[CSV_INDICES.courseId]
  const name = row[CSV_INDICES.name]

  if (name === undefined) console.log(row)

  const course = courses.find((crs) => crs.KOTId === KOTId)

  const id = randomUUID()
  const { latestName, studyStart, eLearning, location, slug } = parseCourseName(KOTId, name)
  const courseNames = course?.courseNames.includes(latestName)
    ? course.courseNames
    : [...(course?.courseNames ?? []), latestName]
  const period: [number, number] = course ? [course.period[0], year] : [year, year]

  const newCourse = {
    id,
    KOTId,
    courseNames,
    latestName,
    studyStart,
    eLearning,
    location,
    slug,
    period
  }

  return [...(course ? courses.filter((inst) => inst.KOTId !== KOTId) : courses), newCourse]
}

/** Upserts a `KOTInstitutionCourse` object showing to the ownership of courses per each institution in the array of `KOTInstitutionCourses`. */
function upsertInstitutionCourses(
  institutionCourses: KOTInstitutionCourses[],
  row: string[],
  year: number
): KOTInstitutionCourses[] {
  const KOTCourseId = row[CSV_INDICES.courseId]
  const KOTInstitutionId = row[CSV_INDICES.institutionId]

  const institutionCourse = institutionCourses.find(
    (instCrs) =>
      instCrs.KOTCourseId === KOTCourseId && instCrs.KOTInstitutionId === KOTInstitutionId
  )
  const period: [number, number] = institutionCourse
    ? [institutionCourse.period[0], year]
    : [year, year]

  const id = randomUUID()

  const newInstitutionCourse = {
    id,
    KOTCourseId,
    KOTInstitutionId,
    period
  }

  return [
    ...(institutionCourse
      ? institutionCourses.filter((instCrs) => instCrs.id !== institutionCourse.id)
      : institutionCourses),
    newInstitutionCourse
  ]
}

/** Upserts `KOTData` object for a single course in the array of `KOTData`. */
function upsertCourseData(entries: KOTData[], row: string[], year: number): KOTData[] {
  const KOTId = row[CSV_INDICES.courseId]

  const entry = entries.find((ent) => ent.KOTId === KOTId)

  const id = randomUUID()

  /* Since some columns were added in later years in the .csv files, we need to account
     for the offset that this causes in the combined .csv file. This slightly hacky
     solution does that by using differences indices. */
  const indices = getAdjustedDataPointKeys(year)
  const data = [
    ...(entry?.data ?? []),
    {
      year,
      ...(_.fromPairs(
        Object.values(K).map((key) => [
          key,
          convertToType(row[indices[key]] ?? '', KOTDataType[key])
        ])
      ) as KOTDataTypes)
    }
  ]

  const newEntry = {
    id,
    KOTId,
    data
  }

  return [...(entry ? entries.filter((ent) => ent.id !== entry.id) : entries), newEntry]
}

/** Upserts `KOTData` object containing data summarized across all courses for a single institution in the array of `KOTData`. */
function upsertInstitutionData(
  entries: KOTData[],
  institutionCourses: KOTInstitutionCourses[],
  row: string[],
  year: number
): KOTData[] {
  const KOTId = row[CSV_INDICES.institutionId]

  const entry = entries.find((ent) => ent.KOTId === KOTId)

  const id = randomUUID()

  const courseIds = institutionCourses
    .filter((instCrs) => instCrs.KOTInstitutionId === KOTId)
    .map((instCrs) => instCrs.KOTCourseId)

  /* We are summing all numerical values here - since we're dealing with the number of people
     here in all numerical categories, we can do this but this may change in future. */
  const summedDataPoints = entries
    .filter(
      (entry) =>
        courseIds.includes(entry.KOTId) && entry.data.some((datapoint) => datapoint.year === year)
    )
    .map((entry) => entry.data.find((datapoint) => datapoint.year === year))
    .reduce((acc, datapoint) => {
      return _.mergeWith(acc, datapoint, (val1: string | number, val2: string | number) =>
        typeof val1 === 'number' && typeof val2 === 'number' ? val1 + val2 : null
      )
    })

  const omittedDataPoints = {
    year,
    ...(_.omitBy(
      summedDataPoints,
      (value, key) => (value !== 0 && !value) || key === 'year'
    ) as KOTDataTypes)
  }

  // Verify that the given institution summary data equals the computed summary data.
  const availableCategories = [
    K.AcceptedAdmitted,
    K.AcceptedStandby,
    K.AppliedTotal,
    K.AppliedFirstpriority
  ]
  availableCategories.forEach((key: K) => {
    const given = convertToType(row[CSV_INDICES[key]], 'number')
    const computed = omittedDataPoints[key]
    if (!(given === computed)) {
      throw new Error(
        `Institution with ID ${KOTId} in year ${year} does not sum to same number for property ${key}.\n Given: ${given}\n Computed: ${computed}`
      )
    }
  })

  const data = [...(entry?.data ?? []), omittedDataPoints]

  const newEntry = {
    id,
    KOTId,
    data
  }

  return [...(entry ? entries.filter((ent) => ent.id !== entry.id) : entries), newEntry]
}

/** Returns the correct index map for the data sheet depending on the year. */
function getAdjustedDataPointKeys(year: number) {
  if (year < 2014) return CSV_INDICES_2011
  if (year < 2016) return CSV_INDICES_2014
  return CSV_INDICES
}

/** Returns a boolean indicating whether the input row indicates an institution header. */
function isRowInstitutionHeader(row: string[]) {
  return (
    row[CSV_INDICES.courseId] === '' &&
    row[CSV_INDICES.institutionId] !== '' &&
    row[CSV_INDICES.acceptedAdmitted] === ''
  )
}

/** Returns a boolean indicating whether the input row indicates a course. */
function isRowCourse(row: string[]) {
  return (
    row[CSV_INDICES.courseId] !== '' &&
    (row[CSV_INDICES.acceptedAdmitted] !== '' || row[CSV_INDICES.appliedTotal] !== '')
  )
}

/** Returns a boolean indicating whether the input row indicates an institution summary. */
function isRowInstitutionSummary(row: string[]) {
  return (
    row.length > 1 &&
    row[CSV_INDICES.courseId] === '' &&
    row[CSV_INDICES.institutionId] !== '' &&
    row[CSV_INDICES.acceptedAdmitted] !== ''
  )
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

/** Parses course names to extract or create the core name, meta-information and slug from the name. */
function parseCourseName(courseId: string, latestName: string) {
  const newLatestName = replaceCourseMetaInParentheses(latestName)
  const parts = newLatestName.split(', ')

  const indexOfLocation = parts.findIndex((part) => CITIES.includes(part.toLowerCase()))

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

/** Transforms an item in the array of meta-data into a standarized format. */
function transformMetaData(metaData: string[]): {
  studyStart: 'summerstart' | 'winterstart' | null
  eLearning: boolean
  location: string | null
} {
  let studyStart: 'summerstart' | 'winterstart' | null = null
  let eLearning = false
  let location: string | null = null

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
    if (CITIES.includes(item)) {
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

/** Converts a thousand-seperated integer to a number if the string contains only numerical characters or dots, or returns the string unchanged if type is string. */
export function convertToType(str: string, type: 'string' | 'number') {
  if (type === 'string') return str
  if (type === 'number') {
    if (str === '') return 0

    if (!str) {
      throw new Error(`${str} cannot be parsed to a float.`)
    }

    // Check if the string contains only numerical characters or dots.
    if (/^[\d.]+$/.test(str)) {
      return parseFloat(str.replace('.', ''))
    }

    // Return the string unchanged if it doesn't contain only numbers and dots.
    return str
  }
}

/** Reads a .csv file from a filepath and returns it in the format of a two-dimensional array of strings. */
export async function readCSV(filePath: string): Promise<string[][]> {
  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()

  return new Promise((resolve) => {
    Papa.parse(csvData, {
      delimiter: ';',
      complete: (results) => {
        resolve(results.data as string[][])
      }
    })
  })
}

const AVAILABLE_YEARS = [
  2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
] as const
export const LATEST_YEAR = AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1]

const FILEPATH = 'data'

const CSV_INDICES = {
  courseId: 0,
  institutionId: 1,
  name: 2,
  [K.AcceptedAdmitted]: 3,
  [K.AcceptedStandby]: 4,
  [K.AppliedTotal]: 5,
  [K.AppliedFirstpriority]: 6,
  [K.QuotientPrimary]: 7,
  [K.QuotientStandby]: 8,
  [K.GenderAcceptedMen]: 9,
  [K.GenderAcceptedWomen]: 10,
  genderAcceptedTotal: 11,
  [K.GenderAppliedMen]: 12,
  [K.GenderAppliedWomen]: 13,
  genderAppliedTotal: 14,
  [K.AgeAcceptedYounger]: 15,
  [K.AgeAccepted19]: 16,
  [K.AgeAccepted20]: 17,
  [K.AgeAccepted21]: 18,
  [K.AgeAccepted22]: 19,
  [K.AgeAccepted23]: 20,
  [K.AgeAccepted24]: 21,
  [K.AgeAccepted25]: 22,
  [K.AgeAccepted26To30]: 23,
  [K.AgeAcceptedOlder]: 24,
  ageAcceptedTotal: 25,
  [K.AgeAppliedYounger]: 26,
  [K.AgeApplied19]: 27,
  [K.AgeApplied20]: 28,
  [K.AgeApplied21]: 29,
  [K.AgeApplied22]: 30,
  [K.AgeApplied23]: 31,
  [K.AgeApplied24]: 32,
  [K.AgeApplied25]: 33,
  [K.AgeApplied26To30]: 34,
  [K.AgeAppliedOlder]: 35,
  ageAppliedTotal: 36,
  [K.EdAcceptedUnknown]: 37,
  [K.EdAcceptedSTX]: 38,
  [K.EdAcceptedHF]: 39,
  [K.EdAcceptedHHX]: 40,
  [K.EdAcceptedHTX]: 41,
  [K.EdAcceptedIB]: 42,
  [K.EdAcceptedGIF]: 43,
  [K.EdAcceptedEngineer]: 44,
  [K.EdAcceptedEUD]: 45,
  [K.EdAcceptedOther]: 46,
  [K.EdAcceptedIBForeign]: 47,
  [K.EdAcceptedForeign]: 48,
  [K.EdAcceptedEUX]: 49,
  [K.EdAcceptedEUXPartOne]: 50,
  [K.EdAcceptedFaroese]: 51,
  [K.EdAcceptedGreenlandic]: 52,
  [K.EdAppliedUnknown]: 53,
  [K.EdAppliedSTX]: 54,
  [K.EdAppliedHF]: 55,
  [K.EdAppliedHHX]: 56,
  [K.EdAppliedHTX]: 57,
  [K.EdAppliedIB]: 58,
  [K.EdAppliedGIF]: 59,
  [K.EdAppliedEngineer]: 60,
  [K.EdAppliedEUD]: 61,
  [K.EdAppliedOther]: 62,
  [K.EdAppliedIBForeign]: 63,
  [K.EdAppliedForeign]: 64,
  [K.EdAppliedEUX]: 65,
  [K.EdAppliedEUXPartOne]: 66,
  [K.EdAppliedFaroese]: 67,
  [K.EdAppliedGreenlandic]: 68
}

const CSV_INDICES_2011 = {
  ...CSV_INDICES,
  [K.EdAcceptedEUX]: 1000,
  [K.EdAcceptedEUXPartOne]: 1000,
  [K.EdAcceptedFaroese]: 1000,
  [K.EdAcceptedGreenlandic]: 1000,
  [K.EdAppliedUnknown]: 49,
  [K.EdAppliedSTX]: 50,
  [K.EdAppliedHF]: 51,
  [K.EdAppliedHHX]: 52,
  [K.EdAppliedHTX]: 53,
  [K.EdAppliedIB]: 54,
  [K.EdAppliedGIF]: 55,
  [K.EdAppliedEngineer]: 56,
  [K.EdAppliedEUD]: 57,
  [K.EdAppliedOther]: 58,
  [K.EdAppliedIBForeign]: 59,
  [K.EdAppliedForeign]: 60
}

const CSV_INDICES_2014 = {
  ...CSV_INDICES,
  [K.EdAcceptedEUXPartOne]: 1000,
  [K.EdAcceptedFaroese]: 1000,
  [K.EdAcceptedGreenlandic]: 1000,
  [K.EdAppliedUnknown]: 50,
  [K.EdAppliedSTX]: 51,
  [K.EdAppliedHF]: 52,
  [K.EdAppliedHHX]: 53,
  [K.EdAppliedHTX]: 54,
  [K.EdAppliedIB]: 55,
  [K.EdAppliedGIF]: 56,
  [K.EdAppliedEngineer]: 57,
  [K.EdAppliedEUD]: 58,
  [K.EdAppliedOther]: 59,
  [K.EdAppliedIBForeign]: 60,
  [K.EdAppliedForeign]: 61,
  [K.EdAppliedEUX]: 62
}

/** All names of cities where a course possibly could take place. */
export const CITIES = [
  'aabenraa',
  'aalborg øst',
  'aalborg sø',
  'aalborg sv',
  'aalborg',
  'aarhus c',
  'aarhus n',
  'auning',
  'ballerup',
  'esbjerg ø',
  'esbjerg',
  'fredensborg',
  'fredericia',
  'frederiksberg c',
  'frederiksberg',
  'frederikshavn',
  'grenaa',
  'haderslev',
  'hadsten',
  'hedensted',
  'herning',
  'hillerød',
  'hjørring',
  'hobro',
  'højbjerg',
  'holbæk',
  'holstebro',
  'horsens',
  'ikast',
  'jelling',
  'risskov',
  'kalundborg',
  'kgs. lyngby',
  'københavn k',
  'københavn n',
  'københavn nv',
  'københavn ø',
  'københavn s',
  'københavn sv',
  'københavn v',
  'køge',
  'kolding',
  'kongens lyngby',
  'lemvig',
  'næstved',
  'nexø',
  'nykøbing f',
  'odense c',
  'odense m (kandidat i odense)',
  'odense m',
  'randers c',
  'randers sø',
  'rønne',
  'roskilde',
  'silkeborg',
  'sisimiut',
  'skive',
  'skovlunde',
  'slagelse',
  'søborg',
  'sønderborg',
  'sorø',
  'svendborg',
  'thisted',
  'tjele',
  'tønder',
  'vejle',
  'vester skerninge',
  'viborg',
  'viby j',
  'vinter',
  'vordingborg',
  'valby',
  'winter'
]
