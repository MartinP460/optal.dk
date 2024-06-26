import Fuse from 'fuse.js'
import type { KOTInstitution } from 'parser'
import data from './data.json'
import { transformInstitutionsToNewFormat } from '$lib/utils/transformInstitutionsToNewFormat'

export const institutions = data as Required<KOTInstitution>[]
export const courses = institutions.flatMap((institution) => institution.courses)
export const courseSearchIndexes = getSearchIndex()

export const newInstitutions = transformInstitutionsToNewFormat(institutions)
export const newCourses = newInstitutions.flatMap((institution) => institution.courses)

function getSearchIndex() {
  const allInstitutions = institutions.map(({ id, latestName }) => ({
    id,
    latestName
  }))
  const allCourses = institutions.flatMap((institution) =>
    institution.courses.map(({ id, latestName, location }) => ({
      id,
      latestName,
      location
    }))
  )

  const institutionIndex = Fuse.createIndex(['latestName'], allInstitutions).toJSON()
  const courseIndex = Fuse.createIndex(['latestName', 'location'], allCourses).toJSON()

  return { institutionIndex, courseIndex }
}
