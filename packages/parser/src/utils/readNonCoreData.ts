import path from 'path'
import { convertToNumber } from './convertToNumber'
import { readCSV } from './readCSV'
import { KOTDataCategories, KOTInstitutionPartial, KOTSubcategory } from '../types'
import { AVAILABLE_YEARS } from '../constants'

export const BASE_CSV_DATA_INDEXES = {
  InstitutionId: 0, // (string) id of the institution
  InstitutionName: 1, // (string) name of the institution
  CourseId: 2, // (string) id of the course
  CourseName: 3 // (string) name of the course
} as const

const CSV_DATA_INDEX_MAP = {
  gender: {
    men: 4, // (integer) number of male applicants/admitted
    women: 5, // (integer) number of female applicants/admitted
    total: 6 // (integer) number of total applicants/admitted
  },
  age: {
    younger: 4, // (integer) number of first-priority applicants younger than 19
    nineteen: 5, // (integer) number of first-priority 19-year-old applicants
    twenty: 6, // (integer) number of first-priority 20-year-old applicants
    twentyOne: 7, // (integer) number of first-priority 21-year-old applicants
    twentyTwo: 8, // (integer) number of first-priority 22-year-old applicants
    twentyThree: 9, // (integer) number of first-priority 23-year-old applicants
    twentyFour: 10, // (integer) number of first-priority 24-year-old applicants
    twentyFive: 11, // (integer) number of first-priority 25-year-old applicants
    twentySixToThirty: 12, // (integer) number of first-priority applicants from ages 26 to 30
    older: 13, // (integer) number of first-priority applicants older than 30
    total: 14 // (integer) number of total first-priority applicants
  }
} as const

/** Parses non-core admission data in CSV format from KOT ("Den koordinerede tilmelding"). */
export async function readData(
  institutions: KOTInstitutionPartial[],
  category: 'gender' | 'age'
): Promise<KOTInstitutionPartial[]> {
  const dataAccepted = await getAcceptedOrAppliedData(institutions, 'accepted', category)
  const dataApplied = await getAcceptedOrAppliedData(dataAccepted, 'applied', category)

  return dataApplied
}

/** Parses data from either the accepted or applied files. */
async function getAcceptedOrAppliedData(
  institutions: KOTInstitutionPartial[],
  type: 'accepted' | 'applied',
  category: 'gender' | 'age'
) {
  let newInstitutions = institutions

  const data = await Promise.all(
    AVAILABLE_YEARS.map((year) => {
      const filePath = path.resolve(`data/${category}/${type}/${year}.csv`)
      return readCSV(filePath)
    })
  )

  data.forEach((rows, i) => {
    rows.forEach((row) => {
      newInstitutions = appendDataToCourse({
        row,
        institutions: newInstitutions,
        year: AVAILABLE_YEARS[i],
        type,
        category
      })
    })
  })

  return newInstitutions
}

/** Appends a new dataset or data entry to a course and returns the updated array of institutions. */
export function appendDataToCourse({
  row,
  institutions,
  year,
  type,
  category
}: {
  row: string[]
  institutions: KOTInstitutionPartial[]
  year: number
  type: 'accepted' | 'applied'
  category: 'age' | 'gender'
}): KOTInstitutionPartial[] {
  const courseId = row[BASE_CSV_DATA_INDEXES.CourseId]
  const institutionId = row[BASE_CSV_DATA_INDEXES.InstitutionId] + '0'

  const institution = institutions.find((institution) => institution.id === institutionId)
  const restInstitutions = institutions.filter((institution) => institution.id !== institutionId)

  if (!institution)
    throw new Error(
      `No institution with id ${institutionId} was found while appending data to course.
      Year: ${year}
      Type: ${type}
      Category: ${category}`
    )

  const course = institution.courses.find((course) => course.id === courseId)
  const restCourses = institution.courses.filter((course) => course.id !== courseId)

  if (!course)
    throw new Error(
      `No course with id ${courseId} from ${institutionId} was found while appending data to course.
      Year: ${year}
      Type: ${type}
      Category: ${category}`
    )

  return [
    ...restInstitutions,
    {
      ...institution,
      courses: [
        ...restCourses,
        {
          ...course,
          dataCategories: addDataCategory({
            row,
            dataCategories: course.dataCategories ?? {},
            year,
            type,
            category
          })
        }
      ]
    }
  ]
}

/** Adds a new data datacategory with new datasets from the given row. */
function addDataCategory({
  row,
  dataCategories,
  year,
  type,
  category
}: {
  row: string[]
  dataCategories: KOTDataCategories
  year: number
  type: 'accepted' | 'applied'
  category: 'age' | 'gender'
}): KOTDataCategories {
  const currentDataset = dataCategories[category]?.datasets.find(
    (datapoint) => datapoint.year === year
  )
  const filteredDatasets =
    dataCategories[category]?.datasets.filter((dataset) => dataset.year !== currentDataset?.year) ??
    []

  return {
    ...dataCategories,
    [category]: {
      name: category,
      unit: null,
      datasets: [
        ...filteredDatasets,
        {
          year,
          ...dataCategories[category]?.datasets.find((datapoint) => datapoint.year === year),
          ...getDatapointsFromCategory({ row, type, category })
        }
      ]
    }
  }
}

/** Gets the datapoints for a dataset from a row. */
function getDatapointsFromCategory({
  row,
  type,
  category
}: {
  row: string[]
  type: 'accepted' | 'applied'
  category: 'age' | 'gender'
}): {
  [key in KOTSubcategory]: number | string
} {
  if (category === 'age') {
    const csvDataIndexes = CSV_DATA_INDEX_MAP[category]

    if (type === 'accepted') {
      // @ts-expect-error We are returning a subset of subcategories but I can't be bothered to fix it.
      return {
        ageAcceptedYounger: convertToNumber(row[csvDataIndexes.younger]),
        ageAccepted19: convertToNumber(row[csvDataIndexes.nineteen]),
        ageAccepted20: convertToNumber(row[csvDataIndexes.twenty]),
        ageAccepted21: convertToNumber(row[csvDataIndexes.twentyOne]),
        ageAccepted22: convertToNumber(row[csvDataIndexes.twentyTwo]),
        ageAccepted23: convertToNumber(row[csvDataIndexes.twentyThree]),
        ageAccepted24: convertToNumber(row[csvDataIndexes.twentyFour]),
        ageAccepted25: convertToNumber(row[csvDataIndexes.twentyFive]),
        ageAccepted26To30: convertToNumber(row[csvDataIndexes.twentySixToThirty]),
        ageAcceptedOlder: convertToNumber(row[csvDataIndexes.older])
      }
    }

    if (type === 'applied') {
      // @ts-expect-error Same as above.
      return {
        ageAppliedYounger: convertToNumber(row[csvDataIndexes.younger]),
        ageApplied19: convertToNumber(row[csvDataIndexes.nineteen]),
        ageApplied20: convertToNumber(row[csvDataIndexes.twenty]),
        ageApplied21: convertToNumber(row[csvDataIndexes.twentyOne]),
        ageApplied22: convertToNumber(row[csvDataIndexes.twentyTwo]),
        ageApplied23: convertToNumber(row[csvDataIndexes.twentyThree]),
        ageApplied24: convertToNumber(row[csvDataIndexes.twentyFour]),
        ageApplied25: convertToNumber(row[csvDataIndexes.twentyFive]),
        ageApplied26To30: convertToNumber(row[csvDataIndexes.twentySixToThirty]),
        ageAppliedOlder: convertToNumber(row[csvDataIndexes.older])
      }
    }
  }

  if (category === 'gender') {
    const csvDataIndexes = CSV_DATA_INDEX_MAP[category]

    if (type === 'accepted') {
      // @ts-expect-error Same as above.
      return {
        genderAcceptedMen: convertToNumber(row[csvDataIndexes.men]),
        genderAcceptedWomen: convertToNumber(row[csvDataIndexes.women])
      }
    }
    if (type === 'applied') {
      // @ts-expect-error Same as above.
      return {
        genderAppliedMen: convertToNumber(row[csvDataIndexes.men]),
        genderAppliedWomen: convertToNumber(row[csvDataIndexes.women])
      }
    }
  }

  throw new Error(`Unknown category: ${category}`)
}
