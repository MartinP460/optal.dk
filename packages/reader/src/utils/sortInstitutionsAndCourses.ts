import { KOTInstitution } from '../types'

/** Sorts institutions and courses. `latestName` is required in all courses. */
export function sortInstitutionsAndCourses(data: KOTInstitution[]): KOTInstitution[] {
  return data
    .map((institution) => ({
      ...institution,
      courses: institution.courses.sort((a, b) =>
        (a.latestName ?? '').localeCompare(b.latestName ?? '', 'en')
      )
    }))
    .sort((a, b) => a.latestName.localeCompare(b.latestName, 'en'))
}
