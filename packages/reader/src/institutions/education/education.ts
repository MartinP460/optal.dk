import { KOTInstitutionPartial } from '../../types'
import { readData } from '../../utils/readNonCoreData'

/** Parses education-related admission data in CSV format from KOT ("Den koordinerede tilmelding"). */
export async function readEducationData(institutions: KOTInstitutionPartial[]) {
  return readData(institutions, 'education')
}
