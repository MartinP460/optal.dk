import { describe, expect, it } from 'vitest'
import {
  getCoreKOTData,
  isRowEmpty,
  isRowInstitution,
  isRowInstitutionSummary,
  parseKOTData,
  populateSingleCourseInstitutions
} from './core'

describe('getCoreKOTData', async () => {
  const data = await getCoreKOTData()

  it('returns the correct number of years for institution data', () => {
    data.forEach((institution) => {
      expect(institution.years.length).toBe(institution.datasets[0].data.length)
    })
  })

  it('returns the correct number of years for course data', () => {
    data.forEach((institution) => {
      institution.courses.forEach((course) => {
        expect(course.years.length).toBeDefined()
      })
    })
  })
})

describe('parseKOTData', () => {
  it('parses data for each year', async () => {
    const startYear = 2011
    const endYear = 2023

    for (let i = startYear; i < endYear + 1; i++) {
      const data = await parseKOTData(i)

      expect(data).toBeDefined()
    }
  })
})

describe('isRowEmpty', () => {
  it('identifies an empty row', () => {
    const row = ['4550', '50000', '', '', '', '', '', '', '']

    expect(isRowEmpty(row)).toBe(true)
  })
})

describe('isRowInstitution', () => {
  it('identifies an institution row', () => {
    const row = [
      '4550',
      '50000',
      'Professionshøjskolen Sjælland University College',
      '',
      '',
      '',
      '',
      '',
      ''
    ]

    expect(isRowInstitution(row, '')).toBe(true)
  })

  it('identifies an institution row when id is empty', () => {
    const row = [
      '4550',
      '',
      'Professionshøjskolen Sjælland University College',
      '',
      '',
      '',
      '',
      '',
      ''
    ]

    expect(isRowInstitution(row, '')).toBe(true)
  })
})

describe('isRowInstitutionSummary', () => {
  it('identifies an institution summary row ', () => {
    const row = [
      '5010',
      '50095',
      'Professionshøjskolen Sjælland University College i alt',
      '2211',
      '49',
      '7255',
      '2472',
      '',
      ''
    ]

    expect(isRowInstitutionSummary(row)).toBe(true)
  })

  it('identifies an institution summary row when id is empty', () => {
    const row = [
      '5010',
      '',
      'Professionshøjskolen Sjælland University College i alt',
      '2211',
      '49',
      '7255',
      '2472',
      '',
      ''
    ]

    expect(isRowInstitutionSummary(row)).toBe(true)
  })
})

describe('populateSingleCourseInstitutions', () => {
  it('populates an institution with a single course with data', () => {
    const institution = [
      {
        id: '',
        institutionNames: ['Kunstakademiets Designskole, Bornholm'],
        years: [2013],
        datasets: [],
        courses: [
          {
            id: '32610',
            courseNames: ['Kunsthåndværker'],
            years: [2013],
            datasets: [
              { id: 1, categories: { category: 'accepted', subcategory: 'admitted' }, data: [28] },
              { id: 2, categories: { category: 'accepted', subcategory: 'standby' }, data: [2] },
              { id: 3, categories: { category: 'applied', subcategory: 'total' }, data: [72] },
              {
                id: 4,
                categories: {
                  category: 'applied',
                  subcategory: 'firstPriority'
                },
                data: [50]
              },
              {
                id: 5,
                categories: {
                  category: 'quotient',
                  subcategory: 'primary'
                },
                data: ['ej kvotesyst.']
              },
              {
                id: 6,
                categories: {
                  category: 'quotient',
                  subcategory: 'standby'
                },
                data: ['']
              }
            ]
          }
        ]
      }
    ]

    // @ts-expect-error The type of label is either of the three specified,
    // but typescript infers it as string
    expect(populateSingleCourseInstitutions(institution)[0].datasets.length).toBe(4)
  })
})
