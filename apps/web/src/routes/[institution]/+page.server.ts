import { error } from '@sveltejs/kit'
import { institutions } from '$lib/server/data'

export async function load({ params }) {
  const institution = institutions.find((institution) => institution.slug === params.institution)

  if (!institution) {
    error(404, 'Institution not found.')
  }

  return {
    institution
  }
}

export async function entries() {
  return institutions.map((institution) => ({
    institution: institution.slug
  }))
}
