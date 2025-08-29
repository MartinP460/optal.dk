import { error } from '@sveltejs/kit'
import { from } from '$lib/server/data'

export async function load({ params }) {
  const institution = from('institutions')
    .select('slug', 'latestName')
    .whereEquals('slug', params.institution)
    .first()

  if (!institution) {
    error(404, 'Institution not found.')
  }

  const course = from('courses').select('*').whereEquals('slug', params.course).first()

  if (!course) {
    error(404, 'Course not found.')
  }

  const { data } = from('data').select('*').whereEquals('foreignKeyId', course.id).first()

  if (!data) {
    error(500, 'Data for course not found.')
  }

  const allInstitutions = from('institutionCourses')
    .select('*')
    .whereEquals('KOTCourseId', course.KOTId)
    .map(({ KOTInstitutionId, period }) => ({
      ...from('institutions')
        .select('id', 'KOTId', 'latestName', 'slug')
        .whereEquals('KOTId', KOTInstitutionId)
        .first(),
      period
    }))

  return {
    institution,
    course,
    data,
    allInstitutions
  }
}

export async function entries() {
  return from('institutionCourses')
    .select('KOTInstitutionId', 'KOTCourseId')
    .map((instCrs) => ({
      course: from('courses')
        .select('KOTId', 'slug')
        .whereEquals('KOTId', instCrs.KOTCourseId)
        .first().slug,
      institution: from('institutions')
        .select('KOTId', 'slug')
        .whereEquals('KOTId', instCrs.KOTInstitutionId)
        .first().slug
    }))
}
