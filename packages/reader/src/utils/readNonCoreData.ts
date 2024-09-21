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
  },
  education: {
    unknown: 4, // (integer) number of applicants/admitted with unspecified degree
    stx: 5, // (integer) number of applicants/admitted with an STX degree
    hf: 6, // (integer) number of applicants/admitted with a HF degree
    hhx: 7, // (integer) number of applicants/admitted with a HHX degree
    htx: 8, // (integer) number of applicants/admitted with a HTX degree
    ib: 9, // (integer) number of applicants/admitted with a IB degree
    gif: 10, // (integer) number of applicants/admitted with a GIF degree
    engineer: 11, // (integer) number of applicants/admitted with an entry exam for engineering degrees
    eud: 12, // (integer) number of applicants/admitted with an EUD degree
    other: 13, // (integer) number of applicants/admitted with a different degreeal background
    ibForeign: 14, // (integer) number of applicants/admitted with a foreign IB degree
    foreign: 15, // (integer) number of applicants/admitted with a foreign degree
    eux: 16, // (integer) number of applicants/admitted with an EUX degree
    euxPartOne: 17, // (integer) number of applicants/admitted with the first part of an EUX degree
    faroese: 18, // (integer) number of applicants/admitted with a faroese degree
    greenlandic: 19 // (integer) number of applicants/admitted with a greenlandic degree
  }
} as const

/** Parses non-core admission data in CSV format from KOT ("Den koordinerede tilmelding"). */
export async function readData(
  institutions: KOTInstitutionPartial[],
  category: 'gender' | 'age' | 'education'
): Promise<KOTInstitutionPartial[]> {
  const dataAccepted = await getAcceptedOrAppliedData(institutions, 'accepted', category)
  const dataApplied = await getAcceptedOrAppliedData(dataAccepted, 'applied', category)

  return dataApplied
}

/** Parses data from either the accepted or applied files. */
async function getAcceptedOrAppliedData(
  institutions: KOTInstitutionPartial[],
  type: 'accepted' | 'applied',
  category: 'gender' | 'age' | 'education'
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
  category: 'age' | 'gender' | 'education'
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
  category: 'age' | 'gender' | 'education'
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
  category: 'age' | 'gender' | 'education'
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

  if (category === 'education') {
    const csvDataIndexes = CSV_DATA_INDEX_MAP[category]

    if (type === 'accepted') {
      // @ts-expect-error Same as above.
      return {
        edAcceptedSTX: convertToNumber(row[csvDataIndexes.stx]),
        edAcceptedHTX: convertToNumber(row[csvDataIndexes.htx]),
        edAcceptedHHX: convertToNumber(row[csvDataIndexes.hhx]),
        edAcceptedHF: convertToNumber(row[csvDataIndexes.hf]),
        // EUX, EUX 1st part, Faroese and Greenlandic were introduced later so some datasets don't have them
        edAcceptedEUX: convertToNumber(row[csvDataIndexes.eux] ?? '0'),
        edAcceptedEUXPartOne: convertToNumber(row[csvDataIndexes.euxPartOne] ?? '0'),
        edAcceptedEUD: convertToNumber(row[csvDataIndexes.eud]),
        edAcceptedIB: convertToNumber(row[csvDataIndexes.ib]),
        edAcceptedIBForeign: convertToNumber(row[csvDataIndexes.ibForeign]),
        edAcceptedGIF: convertToNumber(row[csvDataIndexes.gif]),
        edAcceptedEngineer: convertToNumber(row[csvDataIndexes.engineer]),
        edAcceptedForeign: convertToNumber(row[csvDataIndexes.foreign]),
        edAcceptedFaroese: convertToNumber(row[csvDataIndexes.faroese] ?? '0'),
        edAcceptedGreenlandic: convertToNumber(row[csvDataIndexes.greenlandic] ?? '0'),
        edAcceptedUnknown: convertToNumber(row[csvDataIndexes.unknown]),
        edAcceptedOther: convertToNumber(row[csvDataIndexes.other])
      }
    }

    if (type === 'applied') {
      // @ts-expect-error Same as above.
      return {
        edAppliedSTX: convertToNumber(row[csvDataIndexes.stx]),
        edAppliedHTX: convertToNumber(row[csvDataIndexes.htx]),
        edAppliedHHX: convertToNumber(row[csvDataIndexes.hhx]),
        edAppliedHF: convertToNumber(row[csvDataIndexes.hf]),
        edAppliedEUX: convertToNumber(row[csvDataIndexes.eux] ?? '0'),
        edAppliedEUXPartOne: convertToNumber(row[csvDataIndexes.euxPartOne] ?? '0'),
        edAppliedEUD: convertToNumber(row[csvDataIndexes.eud]),
        edAppliedIB: convertToNumber(row[csvDataIndexes.ib]),
        edAppliedIBForeign: convertToNumber(row[csvDataIndexes.ibForeign]),
        edAppliedGIF: convertToNumber(row[csvDataIndexes.gif]),
        edAppliedEngineer: convertToNumber(row[csvDataIndexes.engineer]),
        edAppliedForeign: convertToNumber(row[csvDataIndexes.foreign]),
        edAppliedFaroese: convertToNumber(row[csvDataIndexes.faroese] ?? '0'),
        edAppliedGreenlandic: convertToNumber(row[csvDataIndexes.greenlandic] ?? '0'),
        edAppliedUnknown: convertToNumber(row[csvDataIndexes.unknown]),
        edAppliedOther: convertToNumber(row[csvDataIndexes.other])
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
