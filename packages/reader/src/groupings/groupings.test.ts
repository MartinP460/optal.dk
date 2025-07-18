import { expect, it } from 'vitest'
import { getGroupings } from './groupings'
import { GroupingName } from '../constants'
import { getInstitutions } from '../institutions'

it('returns the sum of dataset properties for a year', async () => {
  const institutions = await getInstitutions()
  const result = getGroupings(institutions)

  const datalogi = result.find((grouping) => grouping.name === GroupingName.ComputerScience)

  expect(datalogi?.id).toBe('computerScience')
  expect(datalogi?.slug).toBe('computer-science')
  expect(datalogi?.name).toBe('computerScience')
  expect(datalogi?.period).toStrictEqual([2011, 2024])
  expect(datalogi?.parentGroupings).toStrictEqual(['naturalScience', 'it'])

  const accepted = datalogi?.dataCategories.accepted

  expect(accepted?.datasets[0].acceptedAdmitted).toBeDefined()
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
