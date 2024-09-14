import { beforeEach, expect, it } from 'vitest'
import { readAgeData } from './age'
import { KOTInstitution } from '../../types'
import { readCoreData } from '../core/core'

let institutions: KOTInstitution[]

beforeEach(async () => {
  institutions = await readCoreData()
})

it('returns accepted and applied properties', async () => {
  const newInstitutions = await readAgeData(institutions)

  const ku = newInstitutions.find(
    (institution) => institution.latestName === 'Københavns Universitet'
  )
  const cs = ku?.courses.find((course) => course.latestName === 'Datalogi')

  const csAge = cs?.dataCategories.age

  expect(csAge).toBeDefined()
  expect(csAge?.name).toBe('age')

  const twentytwelve = csAge?.datasets[1]

  expect(twentytwelve?.year).toBe(2012)

  expect(twentytwelve?.ageAcceptedYounger).toBeDefined()
  expect(twentytwelve?.ageAccepted22).toBeDefined()
  expect(twentytwelve?.ageAcceptedOlder).toBeDefined()

  expect(twentytwelve?.ageAppliedYounger).toBeDefined()
  expect(twentytwelve?.ageApplied23).toBeDefined()
  expect(twentytwelve?.ageAppliedOlder).toBeDefined()
})
