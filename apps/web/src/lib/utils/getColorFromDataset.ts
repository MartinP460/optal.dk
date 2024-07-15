import type { NewKOTSubcategory } from '$lib/utils/transformInstitutionsToNewFormat'
import type { KOTDataset } from 'parser'

/** Gets the color of the line in the line chart from the dataset. */
export function getColorFromDataset({
  categories: { category, subcategory, subsubcategory }
}: KOTDataset) {
  if (category === 'accepted') {
    if (subcategory === 'admitted') return '#4d7c0f'
    if (subcategory === 'standby') return '#84cc16'
  }

  if (category === 'applied') {
    if (subcategory === 'total') return '#eab308'
    if (subcategory === 'firstPriority') return '#facc15'
  }

  if (category === 'quotient') {
    if (subcategory === 'primary') return '#9f1239'
    if (subcategory === 'standby') return '#f43f5e'
  }

  if (category === 'gender') {
    if (subsubcategory === 'men') return '#38bdf8'
    if (subsubcategory === 'women') return '#e879f9'
  }

  return '#ecfccb'
}

export function getNewGetColorFromDataset(subcategory: NewKOTSubcategory) {
  switch (subcategory) {
    case 'acceptedAdmitted':
      return '#4d7c0f'
    case 'acceptedStandby':
      return '#84cc16'
    case 'appliedTotal':
      return '#eab308'
    case 'appliedFirstpriority':
      return '#facc15'
    case 'quotientPrimary':
      return '#9f1239'
    case 'quotientStandby':
      return '#f43f5e'
    case 'genderAcceptedMen':
    case 'genderAppliedMen':
      return '#38bdf8'
    case 'genderAcceptedWomen':
    case 'genderAppliedWomen':
      return '#e879f9'
    default:
      return '#ecfccb'
  }
}

export function getLabelColorFromLabel(label: KOTDataset['categories']['category']) {
  switch (label) {
    case 'accepted':
      // lime-700
      return '#4d7c0f'
    case 'applied':
      // yellow-500
      return '#eab308'
    case 'quotient':
      // rose-800
      return '#9f1239'
    case 'gender':
      // fuchsia-400
      return '#e879f9'
  }
}
