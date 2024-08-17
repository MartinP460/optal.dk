import _ from 'lodash'
import type {
  KOTCategory,
  KOTData,
  KOTDataCategories,
  KOTDataCategory,
  KOTSubcategory
} from 'parser'
import { chartConfig } from '$lib/utils/chartConfig'

export const displayTypes = ['linechart', 'barchart', 'donutchart', 'table'] as const
export type DisplayType = (typeof displayTypes)[number]

export function getCategories(dataCategories: KOTDataCategories) {
  return Object.keys(dataCategories) as KOTCategory[]
}

export function getSubCategories(dataCategory?: KOTDataCategory) {
  return Object.keys(_.omit(dataCategory?.datasets[0], 'year')) as KOTSubcategory[]
}

export function filterDatasetsBySubCategories(
  dataCategory: KOTDataCategory,
  subCategories: KOTSubcategory[]
) {
  const subCategoriesWithYear = [...subCategories, 'year']

  const newDatasets = dataCategory?.datasets.map((datapoint) =>
    _.pickBy(datapoint, (_, key) => subCategoriesWithYear.includes(key as KOTSubcategory))
  )

  return {
    ...dataCategory,
    datasets: newDatasets
  } as KOTDataCategory
}

export function getDefaultSubCategories(dataCategory: KOTDataCategory) {
  return filterDatasetsBySubCategories(
    dataCategory,
    chartConfig[dataCategory.name].subCategories.default
  )
}

/** Gets the full period of the dataset from the original data category and the data category with the filtered dataset. */
export function getFullPeriodDataset(
  dataCategory: KOTDataCategory,
  originalDataCategory: KOTDataCategory
) {
  const subCategories = getSubCategories(dataCategory)

  return filterDatasetsBySubCategories(originalDataCategory, subCategories)
}

/** Gets the data category with the datasets filtered to only include years in the specified interval. */
export function getCategoryInPeriod(
  dataCategory: KOTDataCategory,
  originalDataCategory: KOTDataCategory,
  period: number[]
) {
  const category = getFullPeriodDataset(dataCategory, originalDataCategory)

  // With datasets with "gaps" in years, this picks the lower and upper bound closest to those given
  const lower = category.datasets.reduce(
    (acc, item, i) => (item.year >= period[0] && acc === -1 ? i : acc),
    -1
  )
  const upper = category.datasets.reduce((acc, item, i) => (item.year <= period[1] ? i : acc), -1)

  const newDataset = category.datasets.slice(lower, upper + 1)

  return {
    ...category,
    datasets: newDataset.length === 0 ? dataCategory.datasets : newDataset
  } as KOTDataCategory
}

export function getSubCategoryValues(dataset: { [key in KOTSubcategory]?: KOTData }) {
  return Object.values(_.omit(dataset, 'year'))
}

export function getDisplayTypesFromDataCategory(category: KOTCategory): DisplayType[] {
  if (category === 'quotient') {
    return displayTypes.filter((type) => type !== 'donutchart')
  }

  // @ts-expect-error It doesn't matter that the constant is not mutable.
  return displayTypes
}

export function getPeriodIntervalFromPeriod(period: number[]) {
  return period.length < 2 || period[0] === period[1] ? period[0] : `${period[0]} - ${period[1]}`
}

export function isDefaultSingleCategory(category: KOTCategory) {
  return chartConfig[category].defaultDisplayType === 'donutchart'
}

export function isDisplayTypeSingleCategory(displayType: DisplayType) {
  return displayType === 'donutchart'
}
