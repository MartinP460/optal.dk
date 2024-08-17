import { error } from '@sveltejs/kit'
import { institutions } from '$lib/server/data'

export async function load({ params }) {
  const institution = institutions.find((institution) => institution.slug === params.institution)

  if (!institution) {
    error(404, 'Institution not found.')
  }

  // Gets the ID of the course
  const regex = /[^-]+$/
  const match = params.course.match(regex)

  if (!match)
    throw new Error(
      `Course not found while generating pages.\n\nInstitution: ${params.institution} \nCourse: ${params.course}`
    )

  const courseId = match[0]
  const course = institution.courses.find((course) => course.id === courseId)

  if (!course) {
    error(404, 'Course not found.')
  }

  return {
    institution: {
      slug: institution.slug,
      latestName: institution.latestName
    },
    course
  }
}

export async function entries() {
  return institutions.flatMap((institution) =>
    institution.courses.map((course) => ({
      course: course.slug,
      institution: institution.slug
    }))
  )
}
