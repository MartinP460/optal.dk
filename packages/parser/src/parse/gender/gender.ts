import { KOTInstitution } from '../../types'
import { readData } from '../../utils/readNonCoreData'

/** Parses gender-related admission data in CSV format from KOT ("Den koordinerede tilmelding"). */
export async function readGenderData(institutions: KOTInstitution[]) {
  return readData(institutions, 'gender')
}
