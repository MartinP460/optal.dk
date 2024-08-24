import { expect, it } from 'vitest'
import { getGroupings } from './groupings'
import { KOTInstitution } from '../types'

const mockInstitutions: Partial<KOTInstitution>[] = [
  {
    latestName: 'KU',
    courses: [
      {
        id: '25306',
        latestName: 'Datalogi',
        courseNames: ['Datalogi'],
        slug: '25306',
        period: [2011, 2024],
        dataCategories: {
          accepted: {
            name: 'accepted',
            unit: 'persons',
            datasets: [{ year: 2011, acceptedAdmitted: 1, acceptedStandby: 0 }]
          },
          quotient: {
            name: 'accepted',
            unit: null,
            datasets: [{ year: 2011, quotientPrimary: '10,0', quotientStandby: '9,1' }]
          }
        }
      },
      {
        id: '22115',
        latestName: 'Datalogi',
        courseNames: ['Datalogi'],
        slug: '25306',
        period: [2011, 2024],
        dataCategories: {
          accepted: {
            name: 'accepted',
            unit: 'persons',
            datasets: [{ year: 2011, acceptedAdmitted: 2, acceptedStandby: 1 }]
          }
        }
      },
      {
        id: '10220',
        latestName: 'Datalogi',
        courseNames: ['Datalogi'],
        slug: '25306',
        period: [2011, 2024],
        dataCategories: {
          accepted: {
            name: 'accepted',
            unit: 'persons',
            datasets: [{ year: 2011, acceptedAdmitted: 3, acceptedStandby: 0 }]
          }
        }
      },
      {
        id: '17020',
        latestName: 'Datalogi',
        courseNames: ['Datalogi'],
        slug: '25306',
        period: [2011, 2024],
        dataCategories: {
          accepted: {
            name: 'accepted',
            unit: 'persons',
            datasets: [{ year: 2011, acceptedAdmitted: 4, acceptedStandby: 1 }]
          }
        }
      }
    ]
  }
]

it('returns the sum of dataset properties for a year', async () => {
  const result = getGroupings(mockInstitutions as KOTInstitution[])

  const datalogi = result.find((grouping) => grouping.name === 'datalogi')

  expect(result[0].courseCount).toBe(4)
  expect(result[0].id).toBe('datalogi')
  expect(result[0].slug).toBe('datalogi')
  expect(result[0].name).toBe('datalogi')
  expect(result[0].period).toStrictEqual([2011, 2024])
  expect(result[0].parentGroupings).toStrictEqual(['it', 'naturalScience'])

  const accepted = datalogi?.dataCategories.accepted

  expect(accepted?.datasets[0].acceptedAdmitted).toBe(10)
  expect(accepted?.datasets[0].acceptedStandby).toBe(2)
})

it('returns the data categories without quotient', async () => {
  const result = getGroupings(mockInstitutions as KOTInstitution[])

  const dataCategories = Object.values(result)
    .flat()
    .find((grouping) => grouping.name === 'datalogi')

  expect(dataCategories?.dataCategories?.quotient).not.toBeDefined()
})
