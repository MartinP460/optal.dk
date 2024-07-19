import { courseSearchIndexes, institutions } from '$lib/server/data'

export const load = () => {
  // we are removing properties to reduce the amount of data sent over the network
  const shortenedInstitutions = institutions.map(({ id, latestName, slug, courses }) => ({
    id,
    latestName,
    slug,
    courses: courses.map(
      ({ id, latestName, slug, location, studyStart, eLearning, dataCategories }) => ({
        id,
        latestName,
        slug,
        location,
        studyStart,
        eLearning,
        dataCategories
      })
    )
  }))

  return {
    institutions: shortenedInstitutions,
    searchIndexes: courseSearchIndexes
  }
}
