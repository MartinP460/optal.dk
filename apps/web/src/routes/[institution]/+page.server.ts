import { error } from '@sveltejs/kit'
import { newInstitutions } from '$lib/server/data'

export async function load({ params }) {
  const institution = newInstitutions.find((institution) => institution.slug === params.institution)

  if (!institution) {
    error(404, 'Institution not found.')
  }

  return {
    institution
  }
}

export async function entries() {
  return newInstitutions.map((institution) => ({
    institution: institution.slug
  }))
}
