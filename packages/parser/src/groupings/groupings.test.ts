import { expect, it } from 'vitest'
import { getGroupings } from './groupings'
import { GroupingName } from '../constants'
import { getInstitutions } from '../institutions'

it.only('returns the sum of dataset properties for a year', async () => {
  const institutions = await getInstitutions()
  const result = getGroupings(institutions)

  const datalogi = result.find((grouping) => grouping.name === GroupingName.ComputerScience)

  expect(result[0].id).toBe('computerScience')
  expect(result[0].slug).toBe('computerScience')
  expect(result[0].name).toBe('computerScience')
  expect(result[0].period).toStrictEqual([2011, 2024])
  expect(result[0].parentGroupings).toStrictEqual(['it', 'naturalScience'])

  const accepted = datalogi?.dataCategories.accepted

  expect(accepted?.datasets[0].acceptedAdmitted).toBeDefined
  expect(accepted?.datasets[0].acceptedStandby).toBeTypeOf('number')
})

it('returns the data categories without quotient', async () => {
  const institutions = await getInstitutions()
  const result = getGroupings(institutions)

  const dataCategories = Object.values(result)
    .flat()
    .find((grouping) => grouping.name === GroupingName.ComputerScience)

  expect(dataCategories?.dataCategories?.quotient).not.toBeDefined()
})
