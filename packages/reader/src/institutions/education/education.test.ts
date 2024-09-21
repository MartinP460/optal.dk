import { beforeEach, expect, it } from 'vitest'
import { readEducationData } from './education'
import { KOTInstitutionPartial } from '../../types'
import { readCoreData } from '../core/core'

let institutions: KOTInstitutionPartial[]

beforeEach(async () => {
  institutions = await readCoreData()
})

it('returns accepted and applied properties', async () => {
  const newInstitutions = await readEducationData(institutions)

  const ku = newInstitutions.find(
    (institution) => institution.latestName === 'Københavns Universitet'
  )
  const cs = ku?.courses.find((course) => course.latestName === 'Datalogi')

  const csEducation = cs?.dataCategories.education

  expect(csEducation).toBeDefined()
  expect(csEducation?.name).toBe('education')

  const twentyEleven = csEducation?.datasets[2]

  expect(twentyEleven?.year).toBe(2013)

  expect(twentyEleven?.edAcceptedSTX).toBeDefined()
  expect(twentyEleven?.edAcceptedHTX).toBeDefined()
  expect(twentyEleven?.edAcceptedHHX).toBeDefined()

  expect(twentyEleven?.edAppliedHF).toBeDefined()
  expect(twentyEleven?.edAppliedGreenlandic).toBeDefined()
  expect(twentyEleven?.edAppliedIBForeign).toBeDefined()
})
