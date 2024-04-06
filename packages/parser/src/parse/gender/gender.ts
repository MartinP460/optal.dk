import path from 'path'
import { readCSV } from '../../utils/readCSV'
import { KOTDataset, KOTInstitution } from '../../types'
import { AVAILABLE_YEARS } from '../../constants'
import { convertToNumber } from '../../utils/convertToNumber'
import { sortInstitutionsAndCourses } from '../../utils/sortInstitutionsAndCourses'

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
export async function getGenderData(
  data: Required<KOTInstitution>[]
): Promise<Required<KOTInstitution>[]> {
  const genderDataAccepted = await getAcceptedOrAppliedGenderData(data, 'accepted')
  const genderDataApplied = await getAcceptedOrAppliedGenderData(genderDataAccepted, 'applied')

  return sortInstitutionsAndCourses(genderDataApplied)
}

/** Parses gender-related data from either the accepted or applied files. */
async function getAcceptedOrAppliedGenderData(
  data: Required<KOTInstitution>[],
  type: 'applied' | 'accepted'
) {
  let newData = [...data]

  const genderData = await Promise.all(
    AVAILABLE_YEARS.map((year) => {
      const filePath = path.resolve(`data/gender/${type}/${year}.csv`)
      return readCSV(filePath)
    })
  )

  genderData.forEach((rows, i) => {
    rows.forEach((row) => {
      const newDatasets = getCourseGenderDistribution(row, AVAILABLE_YEARS[i], type)
      const courseId = row[CSVDataIndexes.CourseId]
      const institutionId = row[CSVDataIndexes.InstitutionId] + '0'

      newData = appendDataToCourse({
        coreData: newData,
        institutionId,
        courseId,
        newDatasets
      })
    })
  })

  return newData
}

/** Gets the gender distribution of a course from a row of data. */
function getCourseGenderDistribution(
  row: string[],
  year: number,
  type: 'applied' | 'accepted'
): KOTDataset[] {
  return [
    {
      id: type === 'accepted' ? 7 : 9,
      categories: {
        category: type === 'accepted' ? 'genderAccepted' : 'genderApplied',
        subcategory: 'men'
      },
      data: [convertToNumber(row[CSVDataIndexes.Men])],
      years: [year]
    },
    {
      id: type === 'accepted' ? 8 : 10,
      categories: {
        category: type === 'accepted' ? 'genderAccepted' : 'genderApplied',
        subcategory: 'women'
      },
      data: [convertToNumber(row[CSVDataIndexes.Women])],
      years: [year]
    }
  ]
}

/** Appends a new dataset or data entry to a course and returns the updated array of institutions. */
export function appendDataToCourse({
  coreData,
  institutionId,
  courseId,
  newDatasets
}: {
  coreData: Required<KOTInstitution>[]
  institutionId: string
  courseId: string
  newDatasets: KOTDataset[]
}): Required<KOTInstitution>[] {
  const institution = coreData.find((institution) => institution.id === institutionId)
  const restInstitutions = coreData.filter((institution) => institution.id !== institutionId)

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

  // merges the data property
  const datasets = newDatasets.map((dataset) => {
    const existingDataset = course.datasets.find((courseDataset) => courseDataset.id === dataset.id)

    return existingDataset
      ? {
          ...existingDataset,
          data: [...existingDataset.data, ...dataset.data],
          years: [...(existingDataset?.years ?? []), ...(dataset.years ?? [])]
        }
      : dataset
  })

  // removes the updated objects
  const previousDatasets = course.datasets.filter(
    (dataset) => !datasets.map(({ id }) => id).includes(dataset.id)
  )

  return [
    ...restInstitutions,
    {
      ...institution,
      courses: [
        ...restCourses,
        {
          ...course,
          datasets: [...previousDatasets, ...datasets]
        }
      ]
    }
  ]
}
