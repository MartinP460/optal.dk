import { error } from '@sveltejs/kit'
import { from } from '$lib/server/data.js'

export async function load({ params }) {
  const grouping = from('groupings').select('*').whereEquals('slug', params.education).first()

  if (!grouping) {
    error(404, 'Education not found.')
  }

  const { data } = from('data')
    .select('foreignKeyId', 'data')
    .whereEquals('foreignKeyId', grouping.id)
    .first()

  const includedCourses = grouping.courseIds.map((courseId) => {
    const course = from('courses')
      .select('id', 'KOTId', 'slug', 'latestName', 'period')
      .whereEquals('KOTId', courseId)
      .first()

    if (!course)
      throw new Error(`No course with ID ${courseId} found for grouping ${grouping.name}`)

    const latestInstitutionId = from('institutionCourses')
      .select('*')
      .whereEquals('KOTCourseId', course.KOTId)
      .reduce((acc, instCrs) =>
        instCrs.period[1] > acc.period[1] ? instCrs : acc
      ).KOTInstitutionId
    const institution = from('institutions')
      .select('KOTId', 'latestName', 'slug')
      .whereEquals('KOTId', latestInstitutionId)
      .first()

    if (!course || !latestInstitutionId || !institution) {
      error(500, 'Course or associated institution included in grouping not found.')
    }

    const { id, slug, latestName, period } = course

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
    data,
    includedCourses
  }
}

export async function entries() {
  return from('groupings')
    .select('slug')
    .map((group) => ({
      education: group.slug
    }))
}
