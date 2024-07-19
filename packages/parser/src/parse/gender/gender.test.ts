import { beforeEach, describe, expect, it } from 'vitest'
import { appendDataToCourse, readGenderData } from './gender'
import { KOTInstitution } from '../../types'
import { readCoreData } from '../core/core'

let coreData: KOTInstitution[]
let institution: KOTInstitution

beforeEach(async () => {
  coreData = await readCoreData()
  institution = coreData[0]
})

it('does stuff', async () => {
  await readGenderData(coreData)
})

describe.skip('parseGenderData', () => {
  it('parses data correctly', async () => {
    const result = await readGenderData(coreData as Required<KOTInstitution>[])

    expect(result).toBeDefined()
  })

  it('appends accepted and applied gender data', async () => {
    const result = await readGenderData(coreData as Required<KOTInstitution>[])
    const course = result[0].courses[0]

    expect(course.datasets).length.greaterThanOrEqual(7)
    expect(
      course.datasets.find((dataset) => dataset.categories.subcategory === 'genderAccepted')
    ).toBeDefined()
    expect(
      course.datasets.find((dataset) => dataset.categories.subcategory === 'genderApplied')
    ).toBeDefined()
  })
})

describe.skip('appendDataToCourse', () => {
  it('creates a deep clone of the array of institutions and appends datasets to a course', () => {
    const courseToUpdate = institution.courses[0]

    const newDatasets1 = [
      {
        id: 7,
        categories: {
          category: 'gender',
          subcategory: 'genderApplied',
          subsubcategory: 'men'
        },
        data: [1],
        years: [2020]
      },
      {
        id: 8,
        categories: {
          category: 'gender',
          subcategory: 'genderApplied',
          subsubcategory: 'women'
        },
        data: [2],
        years: [2020]
      }
    ]

    const newData1 = appendDataToCourse({
      coreData: coreData as Required<KOTInstitution>[],
      institutionId: institution.id,
      courseId: courseToUpdate.id,
      newDatasets: newDatasets1
    })
    const newCourseDataset1 = newData1
      .find((newInstitution) => newInstitution.id === institution.id)
      ?.courses.find((course) => course.id === courseToUpdate.id)?.datasets

    expect(newCourseDataset1).toHaveLength(courseToUpdate.datasets.length + 2)
    expect(newCourseDataset1?.find((dataset) => dataset.id === 7)).toBeDefined()

    const newDatasets2 = [
      {
        id: 7,
        categories: {
          category: 'gender',
          subcategory: 'genderApplied',
          subsubcategory: 'men'
        },
        data: [5],
        years: [2020]
      },
      {
        id: 8,
        categories: {
          category: 'gender',
          subcategory: 'genderApplied',
          subsubcategory: 'women'
        },
        data: [8],
        years: [2020]
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
