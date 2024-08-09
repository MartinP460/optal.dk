import { error } from '@sveltejs/kit'
import { institutions } from '$lib/server/data'

export async function load({ params }) {
  const institution = institutions.find((institution) => institution.slug === params.institution)

  if (!institution) {
    error(404, 'Institution not found.')
  }

  // we are removing properties to reduce the amount of data sent over the network
  const shortenedInstitution = {
    ...institution,
    courses: institution.courses.map(
      ({ id, latestName, slug, location, studyStart, eLearning, period }) => ({
        id,
        latestName,
        slug,
        location,
        studyStart,
        eLearning,
        period
      })
    )
  }

  return {
    institution: shortenedInstitution
  }
}

export async function entries() {
  return institutions.map((institution) => ({
    institution: institution.slug
  }))
}
