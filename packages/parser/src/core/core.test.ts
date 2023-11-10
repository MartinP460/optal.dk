import {
  getCoreKOTData,
  parseKOTData,
  isRowInstitutionSummary,
  isRowInstitution,
  isRowEmpty,
  populateSingleCourseInstitutions,
  applyStrategy,
  convertToNumber
} from './core'
import { describe, it, expect } from 'vitest'

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
              { id: 1, label: 'accepted', category: 'admitted', data: [28] },
              { id: 2, label: 'accepted', category: 'standby', data: [2] },
              { id: 3, label: 'applied', category: 'total', data: [72] },
              { id: 4, label: 'applied', category: 'firstPriority', data: [50] },
              { id: 5, label: 'quotient', category: 'primary', data: ['ej kvotesyst.'] },
              { id: 6, label: 'quotient', category: 'standby', data: [''] }
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

describe('applyStrategy', () => {
  it('applies the strategy for 2012 and 2013', () => {
    const data = [
      [
        '830',
        '11995',
        'Københavns Universitet i alt',
        '7.286',
        '606',
        '0',
        '27.889',
        '12.212',
        '',
        ''
      ],
      ['780', '10368', 'Psykologi', '229', '23', '', '1.764', '1.012', '', '10,9', '10,7']
    ]

    const cleanedData = applyStrategy(data, 2012)

    expect(cleanedData[0]).toHaveLength(8)
    expect(cleanedData[1]).toHaveLength(9)
  })
})

describe('convertToNumber', () => {
  it('converts a comma-seperated floating-point number correctly', () => {
    expect(convertToNumber('1.200')).toBe(1200)
  })
})
