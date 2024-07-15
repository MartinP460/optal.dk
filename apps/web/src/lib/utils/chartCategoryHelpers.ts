import _ from 'lodash'
import type {
  NewKOTCategory,
  NewKOTDataCategories,
  NewKOTDataCategory,
  NewKOTSubcategory
} from '$lib/utils/transformInstitutionsToNewFormat'
import type { DisplayType } from '$lib/types/chartDisplayType'
import { chartConfig } from '$lib/utils/chartConfig'

export function getCategories(dataCategories: NewKOTDataCategories) {
  return Object.keys(dataCategories) as NewKOTCategory[]
}

export function getSubCategories(dataCategory: NewKOTDataCategory) {
  return Object.keys(_.omit(dataCategory.datasets[0], 'year')) as NewKOTSubcategory[]
}

export function filterDatasetsBySubCategories(
  dataCategory: NewKOTDataCategory,
  subCategories: NewKOTSubcategory[]
) {
  const subCategoriesWithYear = [...subCategories, 'year']

  const newDatasets = dataCategory.datasets.map((datapoint) =>
    _.pickBy(datapoint, (_, key) => subCategoriesWithYear.includes(key as NewKOTSubcategory))
  ) as NewKOTDataCategory['datasets']

  return {
    ...dataCategory,
    datasets: newDatasets
  } as NewKOTDataCategory
}

export function getDefaultSubCategories(dataCategory: NewKOTDataCategory) {
  return filterDatasetsBySubCategories(
    dataCategory,
    chartConfig[dataCategory.name].subCategories.default
  )
}

/** Gets the full period of the dataset from the original data category and the data category with the filtered dataset. */
export function getFullPeriodDataset(
  dataCategory: NewKOTDataCategory,
  originalDataCategory: NewKOTDataCategory
) {
  const subCategories = getSubCategories(dataCategory)

  return filterDatasetsBySubCategories(originalDataCategory, subCategories)
}

export function getSubCategoryValues(dataset: NewKOTDataCategory['datasets'][number]) {
  return Object.values(_.omit(dataset, 'year'))
}

export function getDisplayTypesFromDataCategory(dataCategory: NewKOTDataCategory) {
  return Object.keys(chartConfig[dataCategory.name].display) as DisplayType[]
}
