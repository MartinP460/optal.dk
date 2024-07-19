import path from 'path'
import { readCSV } from '../../utils/readCSV'
import { KOTDataCategories, KOTInstitution, KOTSubcategory } from '../../types'
import { AVAILABLE_YEARS } from '../../constants'
import { convertToNumber } from '../../utils/convertToNumber'

enum CSVDataIndexes {
  InstitutionId = 0, // (string) id of the institution
  InstitutionName = 1, // (string) name of the institution
  CourseId = 2, // (string) id of the course
  CourseName = 3, // (string) name of the course
  Men = 4, // (integer) number of male applicants/admitted
  Women = 5, // (integer) number of female applicants/admitted
  Total = 6 // (integer) number of total applicants/admitted
}

/** Parses gender-related admission data in CSV format from KOT ("Den koordinerede tilmelding"). */
export async function readGenderData(institutions: KOTInstitution[]): Promise<KOTInstitution[]> {
  const genderDataAccepted = await getAcceptedOrAppliedGenderData(institutions, 'genderAccepted')
  const genderDataApplied = await getAcceptedOrAppliedGenderData(
    genderDataAccepted,
    'genderApplied'
  )

  return genderDataApplied
}

/** Parses gender-related data from either the accepted or applied files. */
async function getAcceptedOrAppliedGenderData(
  institutions: KOTInstitution[],
  category: 'genderAccepted' | 'genderApplied'
) {
  let newInstitutions = institutions

  const genderData = await Promise.all(
    AVAILABLE_YEARS.map((year) => {
      const filePath = path.resolve(`data/gender/${category}/${year}.csv`)
      return readCSV(filePath)
    })
  )

  genderData.forEach((rows, i) => {
    rows.forEach((row) => {
      newInstitutions = appendDataToCourse({
        row,
        institutions: newInstitutions,
        year: AVAILABLE_YEARS[i],
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
  category
}: {
  row: string[]
  institutions: KOTInstitution[]
  year: number
  category: 'genderAccepted' | 'genderApplied'
}): KOTInstitution[] {
  const courseId = row[CSVDataIndexes.CourseId]
  const institutionId = row[CSVDataIndexes.InstitutionId] + '0'

  const institution = institutions.find((institution) => institution.id === institutionId)
  const restInstitutions = institutions.filter((institution) => institution.id !== institutionId)

  if (!institution)
    throw new Error(
      `No institution with id ${institutionId} was found while appending data to course.`
    )

  const course = institution.courses.find((course) => course.id === courseId)
  const restCourses = institution.courses.filter((course) => course.id !== courseId)

  if (!course)
    throw new Error(
      `No course with id ${courseId} from ${institutionId} was found while appending data to course.`
    )

  return [
    ...restInstitutions,
    {
      ...institution,
      courses: [
        ...restCourses,
        {
          ...course,
          dataCategories: addDataCategories(row, course.dataCategories ?? {}, year, category)
        }
      ]
    }
  ]
}

function addDataCategories(
  row: string[],
  dataCategories: KOTDataCategories,
  year: number,
  category: 'genderAccepted' | 'genderApplied'
): KOTDataCategories {
  const currentDataset = dataCategories.gender?.datasets.find(
    (datapoint) => datapoint.year === year
  )
  const filteredDatasets =
    dataCategories.gender?.datasets.filter((dataset) => dataset.year !== currentDataset?.year) ?? []

  return {
    ...dataCategories,
    gender: {
      name: 'gender',
      unit: null,
      datasets: [
        ...filteredDatasets,
        {
          year,
          ...dataCategories.gender?.datasets.find((datapoint) => datapoint.year === year),
          ...getDatapointsFromCategory(row, category)
        }
      ]
    }
  }
}

function getDatapointsFromCategory(
  row: string[],
  category: 'genderAccepted' | 'genderApplied'
): {
  [key in KOTSubcategory]: number | string
} {
  switch (category) {
    case 'genderAccepted':
      // @ts-expect-error We are returning a subset of subcategories but I can be bothered to fix it.
      return {
        genderAcceptedMen: convertToNumber(row[CSVDataIndexes.Men]),
        genderAcceptedWomen: convertToNumber(row[CSVDataIndexes.Women])
      }
    case 'genderApplied':
      // @ts-expect-error Same as above.
      return {
        genderAppliedMen: convertToNumber(row[CSVDataIndexes.Men]),
        genderAppliedWomen: convertToNumber(row[CSVDataIndexes.Women])
      }
    default:
      throw new Error(`Unknown category: ${category}`)
  }
}
