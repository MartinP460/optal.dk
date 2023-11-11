import Fuse from 'fuse.js'
import data from './data.json'
import type { KOTInstitution } from 'parser'

export const institutions = data as Required<KOTInstitution>[]
export const courses = institutions.flatMap((institution) => institution.courses)
export const courseSearchIndexes = getSearchIndex()

function getSearchIndex() {
  const allInstitutions = institutions.map(({ id, latestName, years, slug }) => ({
    id,
    latestName,
    years,
    slug
  }))
  const allCourses = institutions.flatMap((institution) =>
    institution.courses.map(({ id, latestName, years, studyStart, eLearning, location, slug }) => ({
      id,
      latestName,
      years,
      studyStart,
      eLearning,
      location,
      slug
    }))
  )

  const institutionIndex = Fuse.createIndex(['latestName'], allInstitutions).toJSON()
  const courseIndex = Fuse.createIndex(['latestName', 'location'], allCourses).toJSON()

  return { institutionIndex, courseIndex }
}
