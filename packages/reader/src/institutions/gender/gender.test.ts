import { beforeEach, expect, it } from 'vitest'
import { readGenderData } from './gender'
import { KOTInstitutionPartial } from '../../types'
import { readCoreData } from '../core/core'

let institutions: KOTInstitutionPartial[]

beforeEach(async () => {
  institutions = await readCoreData()
})

it('returns accepted and applied properties with gender-related properties', async () => {
  const newInstitutions = await readGenderData(institutions)

  const ku = newInstitutions.find(
    (institution) => institution.latestName === 'Københavns Universitet'
  )
  const cs = ku?.courses.find((course) => course.latestName === 'Datalogi')

  const csGender = cs?.dataCategories.gender

  expect(csGender).toBeDefined()
  expect(csGender?.name).toBe('gender')

  const twentytwelve = csGender?.datasets[1]

  expect(twentytwelve?.year).toBe(2012)

  expect(twentytwelve?.genderAcceptedMen).toBeDefined()
  expect(twentytwelve?.genderAcceptedWomen).toBeDefined()

  expect(twentytwelve?.genderAppliedMen).toBeDefined()
  expect(twentytwelve?.genderAppliedWomen).toBeDefined()
})
