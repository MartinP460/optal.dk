import { error } from '@sveltejs/kit'
import { groupings, institutions } from '$lib/server/data'

export async function load({ params }) {
  const grouping = groupings.find((grouping) => grouping.slug === params.education)

  if (!grouping) {
    error(404, 'Education not found.')
  }

  const includedCourses = grouping.courseIds.map((courseId) => {
    const coursesWithInstitutions = institutions.flatMap((institution) =>
      institution.courses.map((course) => ({
        ...course,
        institution: {
          id: institution.id,
          slug: institution.slug,
          latestName: institution.latestName
        }
      }))
    )

    const course = coursesWithInstitutions.find((course) => course.id === courseId)

    if (!course) {
      error(500, 'Course included in grouping not found.')
    }

    const { id, slug, latestName, period, institution } = course

    return {
      id,
      slug,
      latestName,
      period,
      institution
    }
  })

  return {
    grouping,
    includedCourses
  }
}

export async function entries() {
  return groupings.map((group) => ({
    education: group.slug
  }))
}
