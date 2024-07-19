import _ from 'lodash'
import type { KOTCategory, KOTDataCategories, KOTDataCategory, KOTSubcategory } from 'parser'
import type { DisplayType } from '$lib/types/chartDisplayType'
import { chartConfig } from '$lib/utils/chartConfig'

export function getCategories(dataCategories: KOTDataCategories) {
  return Object.keys(dataCategories) as KOTCategory[]
}

export function getSubCategories(dataCategory: KOTDataCategory) {
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

export function getSubCategoryValues(dataset: { [key in KOTSubcategory]: string | number }) {
  return Object.values(_.omit(dataset, 'year'))
}

export function getDisplayTypesFromDataCategory(dataCategory: KOTDataCategory) {
  return Object.keys(chartConfig[dataCategory?.name].display) as DisplayType[]
}
