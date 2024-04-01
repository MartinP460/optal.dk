import { beforeEach, describe, expect, it } from 'vitest'
import { appendDataToCourse, parseGenderData } from './gender'
import { getCoreData } from '../core'
import { KOTDataset, KOTInstitution } from '../../types'

let coreData: KOTInstitution[]
let institution: KOTInstitution

beforeEach(async () => {
  coreData = await getCoreData()
  institution = coreData[0]
})

describe('parseGenderData', () => {
  it('parses data correctly', async () => {
    const result = await parseGenderData(coreData)

    expect(result).toBeDefined()
  })
})

describe('appendDataToCourse', () => {
  it('create a deep clone of the array of institutions and appends a single dataset in a course', () => {
    const courseToUpdate = institution.courses[0]

    const newDatasets1: KOTDataset[] = [
      {
        id: 7,
        label: 'men',
        subcategory: 'applied',
        data: [1]
      },
      {
        id: 8,
        label: 'women',
        subcategory: 'applied',
        data: [2]
      }
    ]

    const newData1 = appendDataToCourse({
      coreData,
      institutionId: institution.id,
      courseId: courseToUpdate.id,
      newDatasets: newDatasets1
    })
    const newCourseDataset1 = newData1
      .find((newInstitution) => newInstitution.id === institution.id)
      ?.courses.find((course) => course.id === courseToUpdate.id)?.datasets

    expect(newCourseDataset1).toHaveLength(courseToUpdate.datasets.length + 2)
    expect(newCourseDataset1?.find((dataset) => dataset.id === 7)).toBeDefined()

    const newDatasets2: KOTDataset[] = [
      {
        id: 7,
        label: 'men',
        subcategory: 'applied',
        data: [5]
      },
      {
        id: 8,
        label: 'women',
        subcategory: 'applied',
        data: [8]
      }
    ]

    // add another entry of data
    const newData2 = appendDataToCourse({
      coreData: newData1,
      institutionId: institution.id,
      courseId: courseToUpdate.id,
      newDatasets: newDatasets2
    })

    const newCourseDataset2 = newData2
      .find((newInstitution) => newInstitution.id === institution.id)
      ?.courses.find((course) => course.id === courseToUpdate.id)?.datasets

    expect(newCourseDataset2?.find((dataset) => dataset.id === 7)?.data).toStrictEqual([1, 5])
    expect(newCourseDataset2?.find((dataset) => dataset.id === 8)?.data).toStrictEqual([2, 8])
  })
})
