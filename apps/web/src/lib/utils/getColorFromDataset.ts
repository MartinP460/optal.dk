import type { KOTCategory, KOTSubcategory } from 'reader'

export function getColorFromSubcategory(subcategory: KOTSubcategory) {
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
      return '#ef4444' // red-500
    case 'ageAccepted19':
    case 'ageApplied19':
      return '#f97316' // orange-500
    case 'ageAccepted20':
    case 'ageApplied20':
      return '#eab308' // yellow-500
    case 'ageAccepted21':
    case 'ageApplied21':
      return '#84cc16' // lime-500
    case 'ageAccepted22':
    case 'ageApplied22':
      return '#14b8a6' // teal-500
    case 'ageAccepted23':
    case 'ageApplied23':
      return '#06b6d4' // cyan-500
    case 'ageAccepted24':
    case 'ageApplied24':
      return '#3b82f6' // blue-500
    case 'ageAccepted25':
    case 'ageApplied25':
      return '#8b5cf6' // violet-500
    case 'ageAccepted26To30':
    case 'ageApplied26To30':
      return '#d946ef' // fuchsia-500
    case 'ageAcceptedOlder':
    case 'ageAppliedOlder':
      return '#64748b' // slate-500
    default:
      return '#ecfccb'
  }
}

export function getColorFromCategory(label: KOTCategory) {
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
