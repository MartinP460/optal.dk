import { courseSearchIndexes, institutions } from '$lib/server/data'

export const load = () => {
  // we are removing properties to reduce the amount of data sent over the network
  const shortenedInstitutions = institutions.map(({ id, latestName, slug, courses }) => ({
    id,
    latestName,
    slug,
    courses: courses.map(({ id, latestName, slug, location, studyStart, eLearning, datasets }) => ({
      id,
      latestName,
      slug,
      location,
      studyStart,
      eLearning,
      datasets: datasets.slice(0, 1).map(({ years }) => ({ years }))
    }))
  }))

  return {
    institutions: shortenedInstitutions,
    searchIndexes: courseSearchIndexes
  }
}
