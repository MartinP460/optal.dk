import slugify from 'slugify'
import _ from 'lodash'
import Papa from 'papaparse'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'
import {
  DB,
  KOTDataPointKeys as K,
  KOTCourse,
  KOTData,
  KOTDataType,
  KOTDataTypes,
  KOTGrouping,
  KOTInstitution,
  KOTInstitutionCourses
} from './types'
import { groupings as groupingInput } from './groupings'

let institutions: KOTInstitution[] = []
let courses: KOTCourse[] = []
let institutionCourses: KOTInstitutionCourses[] = []
let data: KOTData[] = []
let groupings: KOTGrouping[] = []

/** Reads and returns KOT data across all available years. */
export async function readData(): Promise<DB> {
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
      const rowType = getRowType(row)

      if (rowType === 'institutionHeader') {
        institutions = upsertInstitution(row, year)
      } else if (rowType === 'course') {
        courses = upsertCourse(row, year)
        institutionCourses = upsertInstitutionCourses(row, year)
        data = upsertCourseData(row, year)
      } else if (rowType === 'institutionSummary') {
        data = upsertInstitutionData(row, year)
      }
    })
  })

  institutions = institutions.sort((a, b) => a.latestName.localeCompare(b.latestName, 'en'))
  courses = courses.sort((a, b) => a.latestName.localeCompare(b.latestName, 'en'))

  createGroupings()

  return {
    institutions,
    courses,
    institutionCourses,
    data,
    groupings
  }
}

/** Generic upsert function. */
function upsert<T extends { id: string }>(
  collection: T[],
  newItemData: Partial<T>,
  identifier: (item: T) => boolean,
  updateLogic: (existingItem: T, newItemData: Partial<T>) => T,
  createLogic: (newItemData: Partial<T>) => T
): T[] {
  const existingItem = collection.find(identifier)

  if (existingItem) {
    const updatedItem = updateLogic(existingItem, newItemData)
    return collection.map((item) => (identifier(item) ? updatedItem : item))
  } else {
    const createdItem = createLogic(newItemData)
    return [...collection, createdItem]
  }
}

/** Upserts a `KOTInstitution` object in the array of `KOTInstitution`. */
function upsertInstitution(row: string[], year: number): KOTInstitution[] {
  const KOTId = row[CSV_INDICES.institutionId]
  const latestName = row[CSV_INDICES.name]

  return upsert(
    institutions,
    {
      KOTId,
      latestName,
      slug: createSlug(latestName),
      period: [year, year]
    },
    (inst) => inst.KOTId === KOTId,
    (existingInstitution, newInstitutionData) => {
      const institutionNames = existingInstitution.institutionNames.includes(
        newInstitutionData.latestName!
      )
        ? existingInstitution.institutionNames
        : [...existingInstitution.institutionNames, newInstitutionData.latestName!]
      return {
        ...existingInstitution,
        ...newInstitutionData,
        institutionNames,
        period: [existingInstitution.period[0], year]
      }
    },
    (newInstitutionData) => {
      return {
        id: randomUUID(),
        KOTId: newInstitutionData.KOTId!,
        institutionNames: [newInstitutionData.latestName!],
        latestName: newInstitutionData.latestName!,
        slug: newInstitutionData.slug!,
        period: newInstitutionData.period! as [number, number]
      }
    }
  )
}

/** Upserts a `KOTCourse` object in the array of `KOTCourse`. */
function upsertCourse(row: string[], year: number): KOTCourse[] {
  const KOTId = row[CSV_INDICES.courseId]
  const name = row[CSV_INDICES.name]

  const { latestName, studyStart, eLearning, location, slug } = parseCourseName(KOTId, name)

  return upsert(
    courses,
    {
      KOTId,
      latestName,
      studyStart,
      eLearning,
      location,
      slug,
      period: [year, year]
    },
    (crs) => crs.KOTId === KOTId,
    (existingCourse, newCourseData) => {
      const courseNames = existingCourse.courseNames.includes(newCourseData.latestName!)
        ? existingCourse.courseNames
        : [...existingCourse.courseNames, newCourseData.latestName!]

      return {
        ...existingCourse,
        ...newCourseData,
        courseNames,
        period: [existingCourse.period[0], year]
      }
    },
    (newCourseData) => ({
      id: randomUUID(),
      KOTId: newCourseData.KOTId!,
      courseNames: [newCourseData.latestName!],
      latestName: newCourseData.latestName!,
      studyStart: newCourseData.studyStart!,
      eLearning: newCourseData.eLearning!,
      location: newCourseData.location!,
      slug: newCourseData.slug!,
      period: newCourseData.period! as [number, number]
    })
  )
}

/** Upserts a `KOTInstitutionCourse` object showing to the ownership of courses per each institution in the array of `KOTInstitutionCourses`. */
function upsertInstitutionCourses(row: string[], year: number): KOTInstitutionCourses[] {
  const KOTCourseId = row[CSV_INDICES.courseId]
  const KOTInstitutionId = row[CSV_INDICES.institutionId]

  return upsert(
    institutionCourses,
    {
      KOTCourseId,
      KOTInstitutionId,
      period: [year, year]
    },
    (instCrs) =>
      instCrs.KOTCourseId === KOTCourseId && instCrs.KOTInstitutionId === KOTInstitutionId,
    (existingInstitutionCourse, newInstitutionCourseData) => {
      return {
        ...existingInstitutionCourse,
        ...newInstitutionCourseData,
        period: [existingInstitutionCourse.period[0], year]
      }
    },
    (newInstitutionCourseData) => {
      return {
        id: randomUUID(),
        KOTCourseId: newInstitutionCourseData.KOTCourseId!,
        KOTInstitutionId: newInstitutionCourseData.KOTInstitutionId!,
        period: newInstitutionCourseData.period! as [number, number]
      }
    }
  )
}

/** Upserts `KOTData` object for a single course in the array of `KOTData`. */
function upsertCourseData(row: string[], year: number): KOTData[] {
  const KOTId = row[CSV_INDICES.courseId]

  const course = courses.find((crs) => crs.KOTId === KOTId)
  if (!course) throw new Error(`Course ${KOTId} not found while upserting data.`)

  const indices = getAdjustedDataPointKeys(year)
  const newDataPoint = {
    year,
    ...(_.fromPairs(
      Object.values(K).map((key) => [key, convertToType(row[indices[key]] ?? '', KOTDataType[key])])
    ) as KOTDataTypes)
  }

  return upsert(
    data,
    {
      foreignKeyId: course.id
    },
    (ent) => ent.foreignKeyId === course.id,
    (existingEntry) => ({
      ...existingEntry,
      data: [...existingEntry.data, newDataPoint]
    }),
    (newEntryData) => ({
      id: randomUUID(),
      foreignKeyId: newEntryData.foreignKeyId!,
      data: [newDataPoint]
    })
  )
}

/** Upserts `KOTData` object containing data summarized across all courses for a single institution in the array of `KOTData`. */
function upsertInstitutionData(row: string[], year: number): KOTData[] {
  const KOTId = row[CSV_INDICES.institutionId]

  const institution = institutions.find((inst) => inst.KOTId === KOTId)
  if (!institution) throw new Error(`Institution ${KOTId} not found while upserting data.`)

  const courseIds = institutionCourses
    .filter((instCrs) => instCrs.KOTInstitutionId === KOTId)
    .map((instCrs) => courses.find((crs) => crs.KOTId === instCrs.KOTCourseId)?.id)

  const summedDataPoints = data
    .filter(
      (entry) =>
        courseIds.includes(entry.foreignKeyId) &&
        entry.data.some((datapoint) => datapoint.year === year)
    )
    .map((entry) => entry.data.find((datapoint) => datapoint.year === year))
    .reduce((acc, datapoint) => {
      return _.mergeWith({ ...acc }, datapoint, (val1: string | number, val2: string | number) =>
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

  return upsert(
    data,
    {
      foreignKeyId: institution.id
    },
    (ent) => ent.foreignKeyId === institution.id,
    (existingEntry) => ({
      ...existingEntry,
      data: [...existingEntry.data, omittedDataPoints]
    }),
    (newEntryData) => ({
      id: randomUUID(),
      foreignKeyId: newEntryData.foreignKeyId!,
      data: [omittedDataPoints]
    })
  )
}

/** Creates an array of `KOTGroupings`. */
function createGroupings() {
  groupingInput.forEach(({ name, courseIds, parentGroupings }) => {
    const includedData = courses
      .filter((crs) => courseIds.includes(crs.KOTId))
      .flatMap((crs) => data.find((ent) => ent.foreignKeyId === crs.id)!.data)

    const years = _.sortBy(_.uniq(includedData.map((ent) => ent.year ?? 0)))

    const summedData = years.map((year) =>
      includedData
        .filter((datapoint) => datapoint.year === year)
        .reduce((acc, datapoint) => {
          return {
            ..._.mergeWith({ ...acc }, datapoint, (val1: string | number, val2: string | number) =>
              typeof val1 === 'number' && typeof val2 === 'number' ? val1 + val2 : null
            ),
            year
          }
        })
    )

    const grouping = {
      id: randomUUID(),
      name: name,
      slug: _.kebabCase(name),
      courseIds,
      parentGroupings,
      period: [years[0], years[years.length - 1]] as [number, number]
    }

    const entry = {
      id: randomUUID(),
      foreignKeyId: grouping.id,
      data: summedData
    }

    groupings = [...groupings, grouping]
    data = [...data, entry]
  })
}

/** Returns the correct index map for the data sheet depending on the year. */
function getAdjustedDataPointKeys(year: number) {
  if (year < 2014) return CSV_INDICES_2011
  if (year < 2016) return CSV_INDICES_2014
  return CSV_INDICES
}

/** Returns the type of the row. */
type RowType = 'institutionHeader' | 'course' | 'institutionSummary' | 'unknown'
function getRowType(row: string[]): RowType {
  // Check for institution header row
  if (
    row[CSV_INDICES.courseId] === '' &&
    row[CSV_INDICES.institutionId] !== '' &&
    row[CSV_INDICES.acceptedAdmitted] === ''
  ) {
    return 'institutionHeader'
  }

  // Check for course row
  if (
    row[CSV_INDICES.courseId] !== '' &&
    (row[CSV_INDICES.acceptedAdmitted] !== '' || row[CSV_INDICES.appliedTotal] !== '')
  ) {
    return 'course'
  }

  // Check for institution summary row
  if (
    row.length > 1 &&
    row[CSV_INDICES.courseId] === '' &&
    row[CSV_INDICES.institutionId] !== '' &&
    row[CSV_INDICES.acceptedAdmitted] !== ''
  ) {
    return 'institutionSummary'
  }

  return 'unknown'
}

/** Trims data and replaces all - (dash signs) with 0's. */
function trimData(data: string[][]) {
  return data.map((row) => row.map((item) => (item.trim() === '-' ? '0' : item.trim())))
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

export const AVAILABLE_YEARS = [
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
