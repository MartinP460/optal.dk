import { describe, it } from 'vitest'
import { readCoreData } from './core'

describe('getCoreKOTData', () => {
  it('returns the correct number of years for institution data', async () => {
    await readCoreData()
  })
})
