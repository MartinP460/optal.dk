import { KOTInstitutionPartial } from '../../types'
import { readData } from '../../utils/readNonCoreData'

/** Parses age-related admission data in CSV format from KOT ("Den koordinerede tilmelding"). */
export async function readAgeData(institutions: KOTInstitutionPartial[]) {
  return readData(institutions, 'age')
}
