import type { KOTCategory, KOTSubcategory } from 'parser'

export function getNewGetColorFromDataset(subcategory: KOTSubcategory) {
  switch (subcategory) {
    case 'acceptedAdmitted':
      return '#4d7c0f' // lime-700
    case 'acceptedStandby':
      return '#84cc16' // lime-500
    case 'appliedTotal':
      return '#eab308' // yellow-500
    case 'appliedFirstpriority':
      return '#facc15' // yellow-400
    case 'quotientPrimary':
      return '#9f1239' // rose-800
    case 'quotientStandby':
      return '#f43f5e' // rose-500
    case 'genderAcceptedMen':
    case 'genderAppliedMen':
      return '#38bdf8' // sky-400
    case 'genderAcceptedWomen':
    case 'genderAppliedWomen':
      return '#e879f9' // fuchsia-400
    case 'ageAcceptedYounger':
    case 'ageAppliedYounger':
      return '#ede9fe' // purple-100
    case 'ageAccepted19':
    case 'ageApplied19':
      return '#e9d5ff' // purple-200
    case 'ageAccepted20':
    case 'ageApplied20':
      return '#c4b5fd' // purple-300
    case 'ageAccepted21':
    case 'ageApplied21':
      return '#a78bfa' // purple-400
    case 'ageAccepted22':
    case 'ageApplied22':
      return '#8b5cf6' // purple-500
    case 'ageAccepted23':
    case 'ageApplied23':
      return '#7c3aed' // purple-600
    case 'ageAccepted24':
    case 'ageApplied24':
      return '#6d28d9' // purple-700
    case 'ageAccepted25':
    case 'ageApplied25':
      return '#5b21b6' // purple-800
    case 'ageAccepted26To30':
    case 'ageApplied26To30':
      return '#581c87' // purple-900
    case 'ageAcceptedOlder':
    case 'ageAppliedOlder':
      return '#3b0764' // purple-950
    default:
      return '#ecfccb'
  }
}

export function getLabelColorFromLabel(label: KOTCategory) {
  switch (label) {
    case 'accepted':
      return '#4d7c0f' // lime-700
    case 'applied':
      return '#eab308' // yellow-500
    case 'quotient':
      return '#9f1239' // rose-800
    case 'gender':
      return '#e879f9' // fuchsia-400
    case 'age':
      return '#a855f7' // purple-500
  }
}
