import { error } from '@sveltejs/kit'
import _ from 'lodash'
import { institutions } from '$lib/server/data'

export async function load({ params }) {
  const institution = institutions.find((institution) => institution.slug === params.institution)

  if (!institution) {
    error(404, 'Institution not found.')
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
  return institutions.map((institution) => ({
    institution: institution.slug
  }))
}
