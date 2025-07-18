import Fuse from 'fuse.js'
import type { KOTGrouping, KOTInstitution } from '@optaldk/reader'
import institutionsData from './institutions.json'
import groupingsData from './groupings.json'

export const institutions = institutionsData as KOTInstitution[]
export const courses = institutions.flatMap((institution) => institution.courses)
export const courseSearchIndexes = getSearchIndex()

export const groupings = groupingsData as KOTGrouping[]

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
