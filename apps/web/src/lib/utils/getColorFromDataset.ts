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
    case 'edAcceptedSTX':
    case 'edAppliedSTX':
      return '#7f1d1d' // red-900
    case 'edAcceptedHHX':
    case 'edAppliedHHX':
      return '#2563eb' // blue-600
    case 'edAcceptedHTX':
    case 'edAppliedHTX':
      return '#1e3a8a' // blue-900
    case 'edAcceptedHF':
    case 'edAppliedHF':
      return '#38bdf8' // sky-500
    case 'edAcceptedEUX':
    case 'edAppliedEUX':
      return '#737373' // neutral-500
    case 'edAcceptedEUXPartOne':
    case 'edAppliedEUXPartOne':
      return '#e5e5e5' // neutral-200
    case 'edAcceptedEUD':
    case 'edAppliedEUD':
      return '#581c87' // purple-900
    case 'edAcceptedGIF':
    case 'edAppliedGIF':
      return '#ea580c' // orange-600
    case 'edAcceptedIB':
    case 'edAppliedIB':
      return '#4ade80' // green-400
    case 'edAcceptedIBForeign':
    case 'edAppliedIBForeign':
      return '#14532d' // green-900
    case 'edAcceptedEngineer':
    case 'edAppliedEngineer':
      return '#115e59' // teal-900
    case 'edAcceptedForeign':
    case 'edAppliedForeign':
      return '#c026d3' // fuchsia-600
    case 'edAcceptedFaroese':
    case 'edAppliedFaroese':
      return '#083344' // cyan-950
    case 'edAcceptedGreenlandic':
    case 'edAppliedGreenlandic':
      return '#dc2626' // red-600
    case 'edAcceptedUnknown':
    case 'edAppliedUnknown':
      return '#262626' // neutral-800
    case 'edAcceptedOther':
    case 'edAppliedOther':
      return '#e879f9' // pink-900
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
    case 'education':
      return '#92400e' // amber-800
  }
}
