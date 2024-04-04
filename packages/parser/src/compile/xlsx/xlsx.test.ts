import { beforeAll, describe, expect, it } from 'vitest'
import { createCourseRow, createInstitutionSummaryRow, createSheetsFromKOTData } from './xlsx'
import { getData } from '../../parse'
import { KOTCourse, KOTInstitution } from '../../types'
import { AVAILABLE_YEARS } from '../../utils/availableYears'

const numberOfCourses = 3
const labelGroup = { category: 'accepted', subcategory: 'admitted' } as const
let data: Required<KOTInstitution>[]
let institution0: Required<KOTInstitution>
let institution1: Required<KOTInstitution>
let course: Required<KOTCourse>

beforeAll(async () => {
  const allData = await getData()

  data = allData.slice(0, 2).map((institution) => ({
    ...institution,
    courses: institution.courses.slice(0, numberOfCourses)
  }))

  institution0 = data[0]
  institution1 = data[1]

  course = institution0.courses[0] as Required<KOTCourse>
})

describe('createSheetsFromKOTData', () => {
  it('creates insitution header rows', async () => {
    const transformedData = createSheetsFromKOTData(data)
    const admittedData = transformedData[0]

    const firstInstitutionHeader = admittedData[0][0]
    const secondInstitutionHeader = admittedData[numberOfCourses + 3][0]

    expect(firstInstitutionHeader).toBe(institution0.latestName)
    expect(secondInstitutionHeader).toBe(institution1.latestName)
  })

  it('creates an empty row between institutions', async () => {
    const transformedData = createSheetsFromKOTData(data)
    const admittedData = transformedData[0]

    const emptyRow = admittedData[numberOfCourses + 2]

    expect(emptyRow).toHaveLength(0)
  })

  it('does not create two rows in the summary rows when institution no data exists for category', async () => {
    const transformedData = createSheetsFromKOTData(data)
    const quotientData = transformedData[4]

    const institutionSummaryRow = quotientData[numberOfCourses + 1]

    expect(institutionSummaryRow).toHaveLength(0)
  })
})

describe('createInstitutionSummaryRow', () => {
  it('creates a summary row of total admission figures for an institution', async () => {
    const institutionSummaryRow = createInstitutionSummaryRow(institution0, labelGroup)

    expect(institutionSummaryRow).not.toBe(null)
    expect((institutionSummaryRow as (string | null)[])[0]).toBe(
      `${institution0.latestName} - total`
    )
    expect(institutionSummaryRow).toHaveLength(1 + institution0.datasets[0].data.length)
  })

  it('returns null if no data exists for category', async () => {
    const institutionSummaryRow = createInstitutionSummaryRow(institution0, {
      category: 'quotient',
      subcategory: 'primary'
    })

    expect(institutionSummaryRow).toBe(null)
  })

  it('creates a summary row with empty rows for empty years', () => {
    const institution: Required<KOTInstitution> = {
      id: '1',
      latestName: 'aalborg',
      institutionNames: ['aalborg'],
      datasets: [
        {
          id: 1,
          categories: {
            category: 'accepted',
            subcategory: 'admitted'
          },
          data: [20, 50, 30, 40, 60],
          years: [2011, 2016, 2017, 2020, 2023]
        }
      ],
      courses: [],
      slug: 'aalborg-1'
    }

    const courseRow = createInstitutionSummaryRow(institution, labelGroup)

    expect(courseRow).toStrictEqual([
      'aalborg - total',
      20,
      '',
      '',
      '',
      '',
      50,
      30,
      '',
      '',
      40,
      '',
      '',
      60
    ])
  })
})

describe('createCourseRow', () => {
  const courseRowLength = AVAILABLE_YEARS.length + 1

  it('creates a course row with correct length', () => {
    const courseRow = createCourseRow(course, labelGroup)

    expect(courseRow).toHaveLength(courseRowLength)
  })

  it('creates a course row with empty rows for empty years', () => {
    const course: Required<KOTCourse> = {
      id: '1',
      latestName: 'physics',
      courseNames: ['physics'],
      datasets: [
        {
          id: 1,
          categories: {
            category: 'accepted',
            subcategory: 'admitted'
          },
          data: [10, 50, 30],
          years: [2015, 2016, 2017]
        }
      ],
      studyStart: 'summerstart',
      eLearning: null,
      location: 'viborg',
      slug: 'physics-1'
    }

    const courseRow = createCourseRow(course, labelGroup)

    expect(courseRow).toStrictEqual(['physics', '', '', '', '', 10, 50, 30, '', '', '', '', '', ''])
  })

  it('creates a course row with empty rows for sporadically distributed empty years', () => {
    const course: Required<KOTCourse> = {
      id: '1',
      latestName: 'physics',
      courseNames: ['physics'],
      datasets: [
        {
          id: 1,
          categories: {
            category: 'accepted',
            subcategory: 'admitted'
          },
          data: [20, 50, 30, 40, 60],
          years: [2011, 2016, 2017, 2020, 2023]
        }
      ],
      studyStart: 'summerstart',
      eLearning: null,
      location: 'viborg',
      slug: 'physics-1'
    }

    const courseRow = createCourseRow(course, labelGroup)

    expect(courseRow).toStrictEqual(['physics', 20, '', '', '', '', 50, 30, '', '', 40, '', '', 60])
  })
})
