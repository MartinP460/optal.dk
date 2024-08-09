import { describe, expect, it } from 'vitest'
import { readCoreData } from './core'

describe('getCoreKOTData', () => {
  it('returns all the institutions required properties', async () => {
    const institutions = await readCoreData()

    const ku = institutions.find(
      (institution) => institution.latestName === 'Københavns Universitet'
    )

    expect(ku).toBeDefined()
    expect(ku?.latestName).toBeDefined()
    expect(ku?.id).toBeDefined()
    expect(ku?.institutionNames).toBeDefined
    expect(ku?.institutionNames.includes('Københavns Universitet')).toBeTruthy()
    expect(ku?.period).toStrictEqual([2011, 2024])

    expect(ku?.dataCategories.accepted).toBeDefined()
    expect(ku?.dataCategories.applied).toBeDefined()

    expect(ku?.dataCategories.accepted?.name).toEqual('accepted')
    expect(ku?.dataCategories.applied?.name).toEqual('applied')

    expect(ku?.dataCategories.accepted?.unit).toEqual('persons')

    expect(ku?.dataCategories.accepted?.datasets[0].year).toBeDefined()
    expect(ku?.dataCategories.accepted?.datasets[0].acceptedAdmitted).toBeDefined()
    expect(ku?.dataCategories.accepted?.datasets[0].acceptedStandby).toBeDefined()
    expect(ku?.dataCategories.applied?.datasets[0].appliedTotal).toBeDefined()
    expect(ku?.dataCategories.applied?.datasets[0].appliedFirstpriority).toBeDefined()
  })

  it('returns all the courses required properties', async () => {
    const institutions = await readCoreData()

    const ku = institutions.find(
      (institution) => institution.latestName === 'Københavns Universitet'
    )
    const cs = ku?.courses.find((course) => course.latestName === 'Datalogi')

    expect(cs?.latestName).toBeDefined()
    expect(cs?.id).toBeDefined()
    expect(cs?.courseNames).toBeDefined
    expect(cs?.courseNames.includes('Datalogi')).toBeTruthy()
    expect(cs?.period).toStrictEqual([2011, 2024])

    expect(cs?.dataCategories.accepted).toBeDefined()
    expect(cs?.dataCategories.applied).toBeDefined()

    expect(cs?.dataCategories.accepted?.name).toEqual('accepted')
    expect(cs?.dataCategories.applied?.name).toEqual('applied')
    expect(cs?.dataCategories.quotient?.name).toEqual('quotient')

    expect(cs?.dataCategories.accepted?.unit).toEqual('persons')

    expect(cs?.dataCategories.accepted?.datasets[0].year).toBeDefined()
    expect(cs?.dataCategories.accepted?.datasets[0].acceptedAdmitted).toBeDefined()
    expect(cs?.dataCategories.accepted?.datasets[0].acceptedStandby).toBeDefined()
    expect(cs?.dataCategories.applied?.datasets[0].appliedTotal).toBeDefined()
    expect(cs?.dataCategories.applied?.datasets[0].appliedFirstpriority).toBeDefined()
    expect(cs?.dataCategories.quotient?.datasets[0].quotientPrimary).toBeDefined()
    expect(cs?.dataCategories.quotient?.datasets[0].quotientStandby).toBeDefined()
  })
})
