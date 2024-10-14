import type { DisplayType } from '$lib/utils/chartCategoryHelpers'
import type { KOTCategory, KOTSubcategory } from 'reader'

type ChartConfig = {
  [key in KOTCategory]: {
    subCategories: {
      all: KOTSubcategory[]
      default: KOTSubcategory[]
      groups:
        | {
            subCategories: KOTSubcategory[]
            collapsedSubCategories?: KOTSubcategory[]
            label:
              | 'genderAccepted'
              | 'genderApplied'
              | 'ageAccepted'
              | 'ageApplied'
              | 'edAccepted'
              | 'edApplied'
          }[]
        | null
    }
    defaultDisplayType: DisplayType
  }
}

export const chartConfig: ChartConfig = {
  accepted: {
    subCategories: {
      all: ['acceptedAdmitted', 'acceptedStandby'],
      default: ['acceptedAdmitted', 'acceptedStandby'],
      groups: null
    },
    defaultDisplayType: 'linechart'
  },
  applied: {
    subCategories: {
      all: ['appliedTotal', 'appliedFirstpriority'],
      default: ['appliedTotal', 'appliedFirstpriority'],
      groups: null
    },
    defaultDisplayType: 'linechart'
  },
  quotient: {
    subCategories: {
      all: ['quotientPrimary', 'quotientStandby'],
      default: ['quotientPrimary', 'quotientStandby'],
      groups: null
    },
    defaultDisplayType: 'linechart'
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
    defaultDisplayType: 'barchart'
  },
  age: {
    subCategories: {
      all: [
        'ageAcceptedYounger',
        'ageAccepted19',
        'ageAccepted20',
        'ageAccepted21',
        'ageAccepted22',
        'ageAccepted23',
        'ageAccepted24',
        'ageAccepted25',
        'ageAccepted26To30',
        'ageAcceptedOlder',
        'ageAppliedYounger',
        'ageApplied20',
        'ageApplied21',
        'ageApplied22',
        'ageApplied23',
        'ageApplied24',
        'ageApplied25',
        'ageApplied26To30',
        'ageAppliedOlder'
      ],
      default: [
        'ageAcceptedYounger',
        'ageAccepted19',
        'ageAccepted20',
        'ageAccepted21',
        'ageAccepted22',
        'ageAccepted23',
        'ageAccepted24',
        'ageAccepted25',
        'ageAccepted26To30',
        'ageAcceptedOlder'
      ],
      groups: [
        {
          subCategories: [
            'ageAcceptedYounger',
            'ageAccepted19',
            'ageAccepted20',
            'ageAccepted21',
            'ageAccepted22',
            'ageAccepted23',
            'ageAccepted24',
            'ageAccepted25',
            'ageAccepted26To30',
            'ageAcceptedOlder'
          ],
          label: 'ageAccepted'
        },
        {
          subCategories: [
            'ageAppliedYounger',
            'ageApplied19',
            'ageApplied20',
            'ageApplied21',
            'ageApplied22',
            'ageApplied23',
            'ageApplied24',
            'ageApplied25',
            'ageApplied26To30',
            'ageAppliedOlder'
          ],
          label: 'ageApplied'
        }
      ]
    },
    defaultDisplayType: 'donutchart'
  },
  education: {
    subCategories: {
      all: [
        'edAcceptedUnknown',
        'edAcceptedSTX',
        'edAcceptedHF',
        'edAcceptedHHX',
        'edAcceptedHTX',
        'edAcceptedIB',
        'edAcceptedGIF',
        'edAcceptedEngineer',
        'edAcceptedEUD',
        'edAcceptedIBForeign',
        'edAcceptedForeign',
        'edAcceptedEUX',
        'edAcceptedEUXPartOne',
        'edAcceptedFaroese',
        'edAcceptedGreenlandic',
        'edAcceptedOther',
        'edAppliedUnknown',
        'edAppliedSTX',
        'edAppliedHF',
        'edAppliedHHX',
        'edAppliedHTX',
        'edAppliedIB',
        'edAppliedGIF',
        'edAppliedEngineer',
        'edAppliedEUD',
        'edAppliedIBForeign',
        'edAppliedForeign',
        'edAppliedEUX',
        'edAppliedEUXPartOne',
        'edAppliedFaroese',
        'edAppliedGreenlandic',
        'edAppliedOther'
      ],
      default: [
        'edAcceptedUnknown',
        'edAcceptedSTX',
        'edAcceptedHF',
        'edAcceptedHHX',
        'edAcceptedHTX',
        'edAcceptedIB',
        'edAcceptedGIF',
        'edAcceptedEngineer',
        'edAcceptedEUD',
        'edAcceptedIBForeign',
        'edAcceptedForeign',
        'edAcceptedEUX',
        'edAcceptedEUXPartOne',
        'edAcceptedFaroese',
        'edAcceptedGreenlandic',
        'edAcceptedOther'
      ],
      groups: [
        {
          subCategories: [
            'edAcceptedSTX',
            'edAcceptedHTX',
            'edAcceptedHHX',
            'edAcceptedHF',
            'edAcceptedGIF',
            'edAcceptedEUD',
            'edAcceptedEUX',
            'edAcceptedEUXPartOne',
            'edAcceptedIB',
            'edAcceptedIBForeign',
            'edAcceptedEngineer',
            'edAcceptedForeign',
            'edAcceptedFaroese',
            'edAcceptedGreenlandic',
            'edAcceptedUnknown',
            'edAcceptedOther'
          ],
          collapsedSubCategories: [
            'edAcceptedSTX',
            'edAcceptedHTX',
            'edAcceptedHHX',
            'edAcceptedHF'
          ],
          label: 'edAccepted'
        },
        {
          subCategories: [
            'edAppliedSTX',
            'edAppliedHTX',
            'edAppliedHHX',
            'edAppliedHF',
            'edAppliedGIF',
            'edAppliedEUD',
            'edAppliedEUX',
            'edAppliedEUXPartOne',
            'edAppliedIB',
            'edAppliedIBForeign',
            'edAppliedEngineer',
            'edAppliedForeign',
            'edAppliedFaroese',
            'edAppliedGreenlandic',
            'edAppliedUnknown',
            'edAppliedOther'
          ],
          collapsedSubCategories: ['edAppliedSTX', 'edAppliedHTX', 'edAppliedHHX', 'edAppliedHF'],
          label: 'edApplied'
        }
      ]
    },
    defaultDisplayType: 'donutchart'
  }
}
