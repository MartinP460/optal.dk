import { KOTDataPointKeys as K } from '@optaldk/reader'
import { CategoryLabel } from './categories'

export function getColorFromSubcategory(subcategory: K) {
  switch (subcategory) {
    case K.AcceptedAdmitted:
      return '#4d7c0f' // lime-700
    case K.AcceptedStandby:
      return '#84cc16' // lime-500
    case K.AppliedTotal:
      return '#eab308' // yellow-500
    case K.AppliedFirstpriority:
      return '#facc15' // yellow-400
    case K.QuotientPrimary:
      return '#9f1239' // rose-800
    case K.QuotientStandby:
      return '#f43f5e' // rose-500
    case K.GenderAcceptedMen:
    case K.GenderAppliedMen:
      return '#38bdf8' // sky-400
    case K.GenderAcceptedWomen:
    case K.GenderAppliedWomen:
      return '#e879f9' // fuchsia-400
    case K.AgeAcceptedYounger:
    case K.AgeAppliedYounger:
      return '#ef4444' // red-500
    case K.AgeAccepted19:
    case K.AgeApplied19:
      return '#f97316' // orange-500
    case K.AgeAccepted20:
    case K.AgeApplied20:
      return '#eab308' // yellow-500
    case K.AgeAccepted21:
    case K.AgeApplied21:
      return '#84cc16' // lime-500
    case K.AgeAccepted22:
    case K.AgeApplied22:
      return '#14b8a6' // teal-500
    case K.AgeAccepted23:
    case K.AgeApplied23:
      return '#06b6d4' // cyan-500
    case K.AgeAccepted24:
    case K.AgeApplied24:
      return '#3b82f6' // blue-500
    case K.AgeAccepted25:
    case K.AgeApplied25:
      return '#8b5cf6' // violet-500
    case K.AgeAccepted26To30:
    case K.AgeApplied26To30:
      return '#d946ef' // fuchsia-500
    case K.AgeAcceptedOlder:
    case K.AgeAppliedOlder:
      return '#64748b' // slate-500
    case K.EdAcceptedSTX:
    case K.EdAppliedSTX:
      return '#7f1d1d' // red-900
    case K.EdAcceptedHHX:
    case K.EdAppliedHHX:
      return '#2563eb' // blue-600
    case K.EdAcceptedHTX:
    case K.EdAppliedHTX:
      return '#1e3a8a' // blue-900
    case K.EdAcceptedHF:
    case K.EdAppliedHF:
      return '#38bdf8' // sky-500
    case K.EdAcceptedEUX:
    case K.EdAppliedEUX:
      return '#737373' // neutral-500
    case K.EdAcceptedEUXPartOne:
    case K.EdAppliedEUXPartOne:
      return '#e5e5e5' // neutral-200
    case K.EdAcceptedEUD:
    case K.EdAppliedEUD:
      return '#581c87' // purple-900
    case K.EdAcceptedGIF:
    case K.EdAppliedGIF:
      return '#ea580c' // orange-600
    case K.EdAcceptedIB:
    case K.EdAppliedIB:
      return '#4ade80' // green-400
    case K.EdAcceptedIBForeign:
    case K.EdAppliedIBForeign:
      return '#14532d' // green-900
    case K.EdAcceptedEngineer:
    case K.EdAppliedEngineer:
      return '#115e59' // teal-900
    case K.EdAcceptedForeign:
    case K.EdAppliedForeign:
      return '#c026d3' // fuchsia-600
    case K.EdAcceptedFaroese:
    case K.EdAppliedFaroese:
      return '#083344' // cyan-950
    case K.EdAcceptedGreenlandic:
    case K.EdAppliedGreenlandic:
      return '#dc2626' // red-600
    case K.EdAcceptedUnknown:
    case K.EdAppliedUnknown:
      return '#262626' // neutral-800
    case K.EdAcceptedOther:
    case K.EdAppliedOther:
      return '#e879f9' // pink-900
    default:
      return '#ecfccb'
  }
}

export function getColorFromCategory(label: CategoryLabel) {
  switch (label) {
    case CategoryLabel.Accepted:
      return '#4d7c0f' // lime-700
    case CategoryLabel.Applied:
      return '#eab308' // yellow-500
    case CategoryLabel.Quotient:
      return '#9f1239' // rose-800
    case CategoryLabel.Gender:
      return '#e879f9' // fuchsia-400
    case CategoryLabel.Age:
      return '#a855f7' // purple-500
    case CategoryLabel.Education:
      return '#92400e' // amber-800
  }
}
