import _ from 'lodash'
import path from 'path'
import type { KOTCourse, KOTInstitution } from '../../types'
import { readCSV } from '../../utils/readCSV'
import { AVAILABLE_YEARS } from '../../utils/availableYears'
import { convertToNumber } from '../../utils/convertToNumber'

enum CSVDataIndexes {
  Id = 1, // (string) id of the course or institution
  Name = 2, // (string) name of the course or institution
  AdmittedDirect = 3, // (integer) number of people admitted
  AdmittedStandby = 4, // (integer) number of people put on standby
  AppliedTotal = 5, // (integer) number of people who applied
  AppliedFirstPriority = 6, // (integer) number of people who applied with course as their first priority
  QuotientPrimary = 7, // (float, string or null) quotient (average grade)
  QuotientStandby = 8 // (float, string or null) quotient (average grade) for people put on standby
}

/** Checks whether a row is empty. */
export function isRowEmpty(row: string[]) {
  return row.slice(2).every((item) => item === '')
}

/** Checks whether a single row in the CSV file is an institution. */
export function isRowInstitution(row: string[], activeInstitutionName: string) {
  const id = row[CSVDataIndexes.Id]

  const hasNoIdOrIdEndsWith00 = id.endsWith('00') || id.endsWith('50') || id === ''

  if (
    hasNoIdOrIdEndsWith00 &&
    row[CSVDataIndexes.AdmittedDirect] === '' &&
    row[CSVDataIndexes.Name] !== '' &&
    (!row[CSVDataIndexes.Name].includes(activeInstitutionName) || activeInstitutionName == '')
  ) {
    return true
  }
  return false
}

/** Checks whether a single row in the CSV file is the summary for an institution. */
export function isRowInstitutionSummary(row: string[]) {
  const summaryLabel = 'i alt'

  if (
    row[CSVDataIndexes.Name] !== '' &&
    row[CSVDataIndexes.Name].toLowerCase().endsWith(summaryLabel) &&
    row[CSVDataIndexes.AdmittedDirect] !== '' &&
    row[CSVDataIndexes.QuotientPrimary] === ''
  ) {
    return true
  }
  return false
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

/**
 * Populates summary data for institutions with just one course because they sometimes
 * don't have a seperate row for summaries.
 */
export function populateSingleCourseInstitutions(result: KOTInstitution[]): KOTInstitution[] {
  return result.map((institution) => {
    if (institution.courses.length === 1 && institution.datasets.length === 0) {
      const course = institution.courses[0]

      const acceptedAdmitted = course.datasets.find(
        (dataset) => dataset.label === 'accepted' && dataset.category === 'admitted'
      )
      const acceptedStandby = course.datasets.find(
        (dataset) => dataset.label === 'accepted' && dataset.category === 'standby'
      )
      const applicantsTotal = course.datasets.find(
        (dataset) => dataset.label === 'applied' && dataset.category === 'total'
      )
      const applicantsFirstPriority = course.datasets.find(
        (dataset) => dataset.label === 'applied' && dataset.category === 'firstPriority'
      )

      if (!acceptedAdmitted || !acceptedStandby || !applicantsTotal || !applicantsFirstPriority) {
        throw new Error('could not find course data for institution with single course')
      }

      return {
        ...institution,
        datasets: [
          {
            id: 1,
            label: 'accepted',
            category: 'admitted',
            data: [acceptedAdmitted.data[0]]
          },
          {
            id: 2,
            label: 'accepted',
            category: 'standby',
            data: [acceptedStandby.data[0]]
          },
          {
            id: 3,
            label: 'applied',
            category: 'total',
            data: [applicantsTotal.data[0]]
          },
          {
            id: 4,
            label: 'applied',
            category: 'firstPriority',
            data: [applicantsFirstPriority.data[0]]
          }
        ]
      }
    } else {
      return institution
    }
  })
}

/** Verifies whether fields in the resulting array of objects include the required data. */
function verifyParsedResult(result: KOTInstitution[]) {
  const allInstitutionsHaveData = result.every((institution) => institution.datasets.length !== 0)

  if (!allInstitutionsHaveData) {
    const faultyInstitution = result.find((institution) => institution.datasets.length === 0)

    throw new Error(
      `Parsing error: ${faultyInstitution?.institutionNames[0]} included no summary data.`
    )
  }

  const allCoursesHaveData = result.every((institution) =>
    institution.courses.every((course) => course.datasets.length !== 0)
  )

  if (!allCoursesHaveData) {
    const faultyInstitution = result.find((institution) =>
      institution.courses.find((course) => course.datasets.length === 0)
    )

    throw new Error(
      `Parsing error: Course ${faultyInstitution?.institutionNames[0]} included a course with no data`
    )
  }
}

/** Parses admission-related data in CSV format from KOT ("Den koordinerede tilmelding"). */
export async function parseKOTData(year: number) {
  const filePath = path.resolve(`data/core/${year}.csv`)

  const csvData = await readCSV(filePath)
  const cleanedData = trimData(csvData)
  const data = cleanedData.slice(0, -1)
  // const annualData = csvData[csvData.length - 1]

  let result: KOTInstitution[] = []
  let activeInstitutionName = ''

  for (const row of data) {
    if (isRowInstitution(row, activeInstitutionName)) {
      // assuming we are parsing an institution header

      activeInstitutionName = row[CSVDataIndexes.Name]

      result.push({
        id: row[CSVDataIndexes.Id],
        institutionNames: [row[CSVDataIndexes.Name].trim()],
        years: [year],
        datasets: [],
        courses: []
      })

      continue
    }

    if (isRowInstitutionSummary(row)) {
      // assuming we are parsing an institution summary

      result = result.map((institution: KOTInstitution) =>
        institution.institutionNames[0] === activeInstitutionName
          ? {
              ...institution,
              datasets: [
                {
                  id: 1,
                  label: 'accepted',
                  category: 'admitted',
                  data: [convertToNumber(row[CSVDataIndexes.AdmittedDirect])]
                },
                {
                  id: 2,
                  label: 'accepted',
                  category: 'standby',
                  data: [convertToNumber(row[CSVDataIndexes.AdmittedStandby])]
                },
                {
                  id: 3,
                  label: 'applied',
                  category: 'total',
                  data: [convertToNumber(row[CSVDataIndexes.AppliedTotal])]
                },
                {
                  id: 4,
                  label: 'applied',
                  category: 'firstPriority',
                  data: [convertToNumber(row[CSVDataIndexes.AppliedFirstPriority])]
                }
              ]
            }
          : institution
      )

      continue
    }

    if (!isRowEmpty(row)) {
      // assuming we are parsing a course

      result = result.map((institution: KOTInstitution) =>
        institution.institutionNames[0] === activeInstitutionName
          ? {
              ...institution,
              courses: [
                ...institution.courses,
                {
                  id: row[CSVDataIndexes.Id],
                  courseNames: [row[CSVDataIndexes.Name]],
                  years: [year],
                  datasets: [
                    {
                      id: 1,
                      label: 'accepted',
                      category: 'admitted',
                      data: [convertToNumber(row[CSVDataIndexes.AdmittedDirect])]
                    },
                    {
                      id: 2,
                      label: 'accepted',
                      category: 'standby',
                      data: [convertToNumber(row[CSVDataIndexes.AdmittedStandby])]
                    },
                    {
                      id: 3,
                      label: 'applied',
                      category: 'total',
                      data: [convertToNumber(row[CSVDataIndexes.AppliedTotal])]
                    },
                    {
                      id: 4,
                      label: 'applied',
                      category: 'firstPriority',
                      data: [convertToNumber(row[CSVDataIndexes.AppliedFirstPriority])]
                    },
                    {
                      id: 5,
                      label: 'quotient',
                      category: 'primary',
                      data: [row[CSVDataIndexes.QuotientPrimary]]
                    },
                    {
                      id: 6,
                      label: 'quotient',
                      category: 'standby',
                      data: [row[CSVDataIndexes.QuotientStandby]]
                    }
                  ]
                }
              ]
            }
          : institution
      )
    }
  }

  const populatedData = populateSingleCourseInstitutions(result)

  verifyParsedResult(populatedData)

  return populatedData
}

/** Merges institution names for an array of institutions. */
function mergeInstitutionNames(institutions: KOTInstitution[]) {
  const names: string[] = []

  institutions.forEach((institution) => {
    if (!names.includes(institution.institutionNames[0])) {
      names.push(institution.institutionNames[0])
    }
  })

  return names
}

/** Merges datasets formatted as a KOTDataset. */
function mergeDatasets(courseOrInstitution: KOTInstitution[] | KOTCourse[]) {
  return courseOrInstitution[0].datasets.map((initialDataset) => {
    return {
      ...initialDataset,
      data: courseOrInstitution.map((institution) => {
        const dataset = institution.datasets.find(
          (dataset) =>
            initialDataset.label === dataset.label && initialDataset.category === dataset.category
        )

        if (!dataset) {
          throw new Error('dataset not found while merging')
        }

        return dataset?.data[0]
      })
    }
  })
}

/** Merges course names for an array of courses. */
function mergeCourseNames(courses: KOTCourse[]) {
  const names: string[] = []

  courses.forEach((course) => {
    if (!names.includes(course.courseNames[0])) {
      names.push(course.courseNames[0])
    }
  })

  return names
}

/** Merges an array of courses. */
function mergeCourses(institutions: KOTInstitution[]) {
  const allCourses = institutions.map((institution) => institution.courses).flat()

  const uniqueCourses = allCourses.filter(
    (initalCourse, i, a) => a.findIndex((course) => course.id === initalCourse.id) === i
  )

  return uniqueCourses.map((initialCourse) => {
    // all courses through the years for the selected course
    const allCourses = institutions
      .map(
        (institution) =>
          institution.courses.find((course) => initialCourse.id === course.id) ?? null
      )
      .filter((course) => course !== null) as KOTCourse[]

    return {
      id: initialCourse.id,
      courseNames: mergeCourseNames(allCourses),
      years: allCourses.map((course) => course.years[0]),
      datasets: mergeDatasets(allCourses)
    }
  })
}

/** Gets all unique institution from a 2d array of institutions. */
export function getAllUniqueInstitutions(data: KOTInstitution[][]) {
  const allInstitutions = data
    .map((institutions) => institutions.map((institution) => institution))
    .flat()

  return _.uniqBy(allInstitutions, 'id')
}

/**
 * Fetches all core admission-related data from KOT ("Den koordinerede tilmelding").
 * Source: https://ufm.dk/uddannelse/statistik-og-analyser/sogning-og-optag-pa-videregaende-uddannelser/grundtal-om-sogning-og-optag/kot-hovedtal
 */
export async function getCoreKOTData(): Promise<KOTInstitution[]> {
  const data = await Promise.all(AVAILABLE_YEARS.map((year) => parseKOTData(year)))

  const uniqueCourses = getAllUniqueInstitutions(data)

  return uniqueCourses.map((institution) => {
    // an array of institutions for each year that the institution is present in the data
    const allInstitutionsPerYear = data
      .map(
        (institutions) =>
          institutions.find((otherInstitution) => institution.id === otherInstitution.id) ?? null
      )
      .filter((institution) => institution !== null) as KOTInstitution[]

    return {
      id: allInstitutionsPerYear.find((institution) => institution?.id !== '')?.id ?? '',
      institutionNames: mergeInstitutionNames(allInstitutionsPerYear),
      years: allInstitutionsPerYear.map((institution) => institution.years[0]),
      datasets: mergeDatasets(allInstitutionsPerYear),
      courses: mergeCourses(allInstitutionsPerYear)
    }
  })
}
