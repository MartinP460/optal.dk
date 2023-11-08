import { getAugmentedKOTInstitutions } from '$lib/server/augmented'
import { error } from '@sveltejs/kit'
import _ from 'lodash'

export async function load({ params }) {
  const data = await getAugmentedKOTInstitutions()

  const institution = data.find((institution) => institution.slug === params.institution)

  if (!institution) {
    throw error(404, 'Institution not found.')
  }

  const institutionData = {
    labels: institution.years,
    datasets: institution.datasets
  }

  const institutionLabelGroups = _.toArray(_.groupBy(institution.datasets, 'label'))

  return {
    institution,
    institutionData,
    institutionLabelGroups
  }
}

export async function entries() {
  const data = await getAugmentedKOTInstitutions()

  return data.map((institution) => ({
    institution: institution.slug
  }))
}
