import path from 'path'
import { readCSV } from '../../utils/readCSV'
import { KOTDataset, KOTInstitution } from '../../types'
import { AVAILABLE_YEARS } from '../../utils/availableYears'
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
export async function parseGenderData(data: KOTInstitution[]) {
  let newData = [...data]

  const genderData = await Promise.all(
    AVAILABLE_YEARS.map((year) => {
      const filePath = path.resolve(`data/gender/${year}.csv`)
      return readCSV(filePath)
    })
  )

  genderData.forEach((rows, i) => {
    rows.forEach((row) => {
      const newDatasets = getCourseGenderDistribution(row, AVAILABLE_YEARS[i])
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
function getCourseGenderDistribution(row: string[], year: number): KOTDataset[] {
  return [
    {
      id: 7,
      category: 'men',
      subcategory: 'applied',
      data: [convertToNumber(row[CSVDataIndexes.Men])],
      years: [year]
    },
    {
      id: 8,
      category: 'women',
      subcategory: 'applied',
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
  coreData: KOTInstitution[]
  institutionId: string
  courseId: string
  newDatasets: KOTDataset[]
}): KOTInstitution[] {
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
