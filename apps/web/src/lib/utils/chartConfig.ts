import type { DisplayType } from '$lib/types/chartDisplayType'
import type { KOTCategory, KOTSubcategory } from 'parser'

type ChartConfig = {
  [key in KOTCategory]: {
    subCategories: {
      all: KOTSubcategory[]
      default: KOTSubcategory[]
      groups:
        | { subCategories: KOTSubcategory[]; label: 'genderAccepted' | 'genderApplied' }[]
        | null
    }
    defaultDisplayType: DisplayType
    display: {
      [key in DisplayType]?: {
        periodSelector?: 'multiple' | 'single' | null
      }
    }
  }
}

export const chartConfig: ChartConfig = {
  accepted: {
    subCategories: {
      all: ['acceptedAdmitted', 'acceptedStandby'],
      default: ['acceptedAdmitted', 'acceptedStandby'],
      groups: null
    },
    defaultDisplayType: 'linechart',
    display: {
      linechart: {
        periodSelector: 'multiple'
      },
      barchart: {
        periodSelector: 'multiple'
      },
      table: {}
    }
  },
  applied: {
    subCategories: {
      all: ['appliedTotal', 'appliedFirstpriority'],
      default: ['appliedTotal', 'appliedFirstpriority'],
      groups: null
    },
    defaultDisplayType: 'linechart',
    display: {
      linechart: {
        periodSelector: 'multiple'
      },
      barchart: {
        periodSelector: 'multiple'
      },
      table: {}
    }
  },
  quotient: {
    subCategories: {
      all: ['quotientPrimary', 'quotientStandby'],
      default: ['quotientPrimary', 'quotientStandby'],
      groups: null
    },
    defaultDisplayType: 'linechart',
    display: {
      linechart: {
        periodSelector: 'multiple'
      },
      barchart: {
        periodSelector: 'multiple'
      },
      table: {}
    }
  },
  gender: {
    subCategories: {
      all: ['genderAcceptedMen', 'genderAcceptedWomen', 'genderAppliedMen', 'genderAppliedWomen'],
      default: ['genderAcceptedMen', 'genderAcceptedWomen'],
      groups: [
        { subCategories: ['genderAcceptedMen', 'genderAcceptedWomen'], label: 'genderAccepted' },
        { subCategories: ['genderAppliedMen', 'genderAppliedWomen'], label: 'genderApplied' }
      ]
    },
    defaultDisplayType: 'barchart',
    display: {
      linechart: {
        periodSelector: 'multiple'
      },
      barchart: {
        periodSelector: 'multiple'
      },
      table: {}
    }
  }
}
