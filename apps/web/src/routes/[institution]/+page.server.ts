import { error } from '@sveltejs/kit'
import { from } from '$lib/server/data'

export async function load({ params }) {
  const institution = from('institutions')
    .select('*')
    .whereEquals('slug', params.institution)
    .first()

  if (!institution) {
    error(404, 'Institution not found.')
  }

  const courses = from('institutionCourses')
    .select('KOTCourseId', 'KOTInstitutionId', 'period')
    .whereEquals('KOTInstitutionId', institution.KOTId)
    .map(({ KOTCourseId, period }) => ({
      ...from('courses')
        .select('id', 'KOTId', 'latestName', 'slug', 'location', 'studyStart', 'eLearning')
        .whereEquals('KOTId', KOTCourseId)
        .first(),
      period,
      institution: {
        slug: institution.slug
      }
    }))
    .sort((a, b) => a.latestName.localeCompare(b.latestName, 'en'))

  const { data } = from('data').select('*').whereEquals('foreignKeyId', institution.id).first()

  return {
    institution,
    courses,
    data
  }
}

export async function entries() {
  const institutions = from('institutions').select('slug')

  return institutions.map((institution) => ({
    institution: institution.slug
  }))
}
