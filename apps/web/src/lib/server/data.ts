import Fuse from 'fuse.js'
import type { KOTInstitution } from 'parser'
import data from './data.json'

export const institutions = data as KOTInstitution[]
export const courses = institutions.flatMap((institution) => institution.courses)
export const courseSearchIndexes = getSearchIndex()

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
