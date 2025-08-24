import { NewKOTDataPointKeys as K, type KOTCategory, NewKOTDataPointKeys } from '@optaldk/reader'

export type Categories = {
  [key in KOTCategory]: Category
}

export type Category = {
  label: CategoryLabel
  subcategories: (NewKOTDataPointKeys | SubCategory)[]
  displayTypes: DisplayType[]
  defaultDisplayType: DisplayType
  isStackedBarChart?: boolean
}

export type SubCategory = {
  label: SubCategoryLabel
  subcategories: (NewKOTDataPointKeys | SubCategory)[]
  collapsedSubCategories?: NewKOTDataPointKeys[]
}

export enum DisplayType {
  LineChart = 'lineChart',
  BarChart = 'barChart',
  Donutchart = 'donutChart',
  Table = 'table'
}

export enum CategoryLabel {
  Accepted = 'accepted',
  Applied = 'applied',
  Quotient = 'quotient',
  Gender = 'gender',
  Age = 'age',
  Education = 'education'
}

export enum SubCategoryLabel {
  GenderAccepted = 'genderAccepted',
  GenderApplied = 'genderApplied',
  AgeAccepted = 'ageAccepted',
  AgeApplied = 'ageApplied',
  EdAccepted = 'edAccepted',
  EdApplied = 'edApplied'
}

export function getDefaultSubcategories(
  subcategories: (NewKOTDataPointKeys | SubCategory)[]
): (NewKOTDataPointKeys | SubCategory)[] {
  // We use the first item in subcategories as the default.
  const DEFAULT_SUBCATEGORY_INDEX = 0

  return typeof subcategories[0] === 'string'
    ? subcategories
    : [
        {
          ...subcategories[DEFAULT_SUBCATEGORY_INDEX],
          subcategories: getDefaultSubcategories(
            subcategories[DEFAULT_SUBCATEGORY_INDEX].subcategories
          )
        }
      ]
}

export const categories: Categories = {
  [CategoryLabel.Accepted]: {
    label: CategoryLabel.Accepted,
    subcategories: [K.AcceptedAdmitted, K.AcceptedStandby],
    displayTypes: [
      DisplayType.LineChart,
      DisplayType.BarChart,
      DisplayType.Donutchart,
      DisplayType.Table
    ],
    defaultDisplayType: DisplayType.LineChart
  },
  [CategoryLabel.Applied]: {
    label: CategoryLabel.Applied,
    subcategories: [K.AppliedTotal, K.AppliedFirstpriority],
    displayTypes: [
      DisplayType.LineChart,
      DisplayType.BarChart,
      DisplayType.Donutchart,
      DisplayType.Table
    ],
    defaultDisplayType: DisplayType.LineChart
  },
  [CategoryLabel.Quotient]: {
    label: CategoryLabel.Quotient,
    subcategories: [K.QuotientPrimary, K.QuotientStandby],
    displayTypes: [DisplayType.LineChart, DisplayType.BarChart, DisplayType.Table],
    defaultDisplayType: DisplayType.LineChart
  },
  [CategoryLabel.Gender]: {
    label: CategoryLabel.Gender,
    subcategories: [
      {
        subcategories: [K.GenderAcceptedMen, K.GenderAcceptedWomen],
        label: SubCategoryLabel.GenderAccepted
      },
      {
        subcategories: [K.GenderAppliedMen, K.GenderAppliedWomen],
        label: SubCategoryLabel.GenderApplied
      }
    ],
    displayTypes: [
      DisplayType.LineChart,
      DisplayType.BarChart,
      DisplayType.Donutchart,
      DisplayType.Table
    ],
    defaultDisplayType: DisplayType.BarChart,
    isStackedBarChart: true
  },
  [CategoryLabel.Age]: {
    label: CategoryLabel.Age,
    subcategories: [
      {
        subcategories: [
          K.AgeAcceptedYounger,
          K.AgeAccepted19,
          K.AgeAccepted20,
          K.AgeAccepted21,
          K.AgeAccepted22,
          K.AgeAccepted23,
          K.AgeAccepted24,
          K.AgeAccepted25,
          K.AgeAccepted26To30,
          K.AgeAcceptedOlder
        ],
        label: SubCategoryLabel.AgeAccepted
      },
      {
        subcategories: [
          K.AgeAppliedYounger,
          K.AgeApplied19,
          K.AgeApplied20,
          K.AgeApplied21,
          K.AgeApplied22,
          K.AgeApplied23,
          K.AgeApplied24,
          K.AgeApplied25,
          K.AgeApplied26To30,
          K.AgeAppliedOlder
        ],
        label: SubCategoryLabel.AgeApplied
      }
    ],
    displayTypes: [
      DisplayType.LineChart,
      DisplayType.BarChart,
      DisplayType.Donutchart,
      DisplayType.Table
    ],
    defaultDisplayType: DisplayType.Donutchart,
    isStackedBarChart: true
  },
  [CategoryLabel.Education]: {
    label: CategoryLabel.Education,
    subcategories: [
      {
        subcategories: [
          K.EdAcceptedSTX,
          K.EdAcceptedHTX,
          K.EdAcceptedHHX,
          K.EdAcceptedHF,
          K.EdAcceptedGIF,
          K.EdAcceptedEUD,
          K.EdAcceptedEUX,
          K.EdAcceptedEUXPartOne,
          K.EdAcceptedIB,
          K.EdAcceptedIBForeign,
          K.EdAcceptedEngineer,
          K.EdAcceptedForeign,
          K.EdAcceptedFaroese,
          K.EdAcceptedGreenlandic,
          K.EdAcceptedUnknown,
          K.EdAcceptedOther
        ],
        collapsedSubCategories: [K.EdAcceptedSTX, K.EdAcceptedHTX, K.EdAcceptedHHX, K.EdAcceptedHF],
        label: SubCategoryLabel.EdAccepted
      },
      {
        subcategories: [
          K.EdAppliedSTX,
          K.EdAppliedHTX,
          K.EdAppliedHHX,
          K.EdAppliedHF,
          K.EdAppliedGIF,
          K.EdAppliedEUD,
          K.EdAppliedEUX,
          K.EdAppliedEUXPartOne,
          K.EdAppliedIB,
          K.EdAppliedIBForeign,
          K.EdAppliedEngineer,
          K.EdAppliedForeign,
          K.EdAppliedFaroese,
          K.EdAppliedGreenlandic,
          K.EdAppliedUnknown,
          K.EdAppliedOther
        ],
        collapsedSubCategories: [K.EdAppliedSTX, K.EdAppliedHTX, K.EdAppliedHHX, K.EdAppliedHF],
        label: SubCategoryLabel.EdApplied
      }
    ],
    displayTypes: [
      DisplayType.LineChart,
      DisplayType.BarChart,
      DisplayType.Donutchart,
      DisplayType.Table
    ],
    defaultDisplayType: DisplayType.Donutchart,
    isStackedBarChart: true
  }
}
