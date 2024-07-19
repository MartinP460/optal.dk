import type { KOTCategory, KOTSubcategory } from 'parser'

export function getNewGetColorFromDataset(subcategory: KOTSubcategory) {
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

export function getLabelColorFromLabel(label: KOTCategory) {
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
