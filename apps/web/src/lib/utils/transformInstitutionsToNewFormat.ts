import _ from 'lodash'
import type { KOTCourse, KOTDataset, KOTInstitution, Unit } from 'parser'

export type NewKOTCategory = 'accepted' | 'applied' | 'quotient' | 'gender'

type NewKOTDatasetCategory = {
  accepted: 'acceptedAdmitted' | 'acceptedStandby'
  applied: 'appliedTotal' | 'appliedFirstpriority'
  quotient: 'quotientPrimary' | 'quotientStandby'
  gender: 'genderAcceptedMen' | 'genderAcceptedWomen' | 'genderAppliedMen' | 'genderAppliedWomen'
}

type DatasetKeys = keyof NewKOTDatasetCategory
export type NewKOTSubcategory = NewKOTDatasetCategory[DatasetKeys]

type NewKOTData = string | number

export type NewKOTDataCategoryGeneric<T> = {
  name: NewKOTCategory
  unit: Unit
  datasets: T[]
}

export type NewKOTDataCategories = {
  accepted: NewKOTDataCategoryGeneric<{
    year: number
    acceptedAdmitted: NewKOTData
    acceptedStandby: NewKOTData
  }>
  applied: NewKOTDataCategoryGeneric<{
    year: number
    appliedTotal: NewKOTData
    appliedFirstpriority: NewKOTData
  }>
  quotient: NewKOTDataCategoryGeneric<{
    year: number
    quotientPrimary: NewKOTData
    quotientStandby: NewKOTData
  }>
  gender: NewKOTDataCategoryGeneric<{
    year: number
    genderAcceptedMen: NewKOTData
    genderAcceptedWomen: NewKOTData
    genderAppliedMen: NewKOTData
    genderAppliedWomen: NewKOTData
  }>
}

type CategoryKeys = keyof NewKOTDataCategories
export type NewKOTDataCategory = NewKOTDataCategories[CategoryKeys]

export type NewKOTCourse = Required<KOTCourse> & {
  /** The different categories of data available for the course. */
  dataCategories: NewKOTDataCategories
}

export type NewKOTInstitution = Required<Omit<KOTInstitution, 'courses'>> & {
  /** The different categories of data available for the institution. */
  dataCategories: NewKOTDataCategories
  /** The courses the insitution offered since 2011. */
  courses: NewKOTCourse[]
}

export function transformInstitutionsToNewFormat(
  institutions: Required<KOTInstitution>[]
): NewKOTInstitution[] {
  return institutions.map((institution) => ({
    ...institution,
    courses: institution.courses.map((course) => ({
      ...course,
      dataCategories: _.mapValues(_.groupBy(course.datasets, 'categories.category'), (datasets) => {
        const newDatasets = renameDatasets(datasets)

        return {
          name: datasets[0].categories.category,
          unit: datasets[0].unit,
          datasets: formatData(newDatasets)
        }
      })
    })),
    dataCategories: _.mapValues(
      _.groupBy(institution.datasets, 'categories.category'),
      (datasets) => {
        const newDatasets = renameDatasets(datasets)

        return {
          name: datasets[0].categories.category,
          unit: datasets[0].unit,
          datasets: formatData(newDatasets)
        }
      }
    )
  }))
}

function formatData(datasets: KOTDataset[]): NewKOTDataCategory['datasets'] {
  return datasets[0].data.map((_, i) => ({
    year: datasets[0].years[i],
    ...datasets.reduce(
      (acc, elm) => ({
        ...acc,
        [elm.categories.subcategory]: elm.data[i]
      }),
      {}
    )
  }))
}

function renameDatasets(datasets: KOTDataset[]): NewKOTDataCategory['datasets'] {
  return datasets.map((dataset) => {
    if (dataset.categories.category === 'accepted') {
      return {
        ...dataset,
        categories: {
          category: 'accepted',
          subcategory:
            dataset.categories.subcategory === 'admitted' ? 'acceptedAdmitted' : 'acceptedStandby'
        }
      }
    }

    if (dataset.categories.category === 'applied') {
      return {
        ...dataset,
        categories: {
          category: 'applied',
          subcategory:
            dataset.categories.subcategory === 'total' ? 'appliedTotal' : 'appliedFirstpriority'
        }
      }
    }

    if (dataset.categories.category === 'quotient') {
      return {
        ...dataset,
        categories: {
          category: 'applied',
          subcategory:
            dataset.categories.subcategory === 'primary' ? 'quotientPrimary' : 'quotientStandby'
        }
      }
    }

    if (dataset.categories.subcategory === 'genderAccepted') {
      if (dataset.categories.subsubcategory === 'men') {
        return {
          ...dataset,
          categories: {
            category: 'gender',
            subcategory: 'genderAcceptedMen',
            subsubcategory: null
          }
        }
      } else {
        return {
          ...dataset,
          categories: {
            category: 'gender',
            subcategory: 'genderAcceptedWomen',
            subsubcategory: null
          }
        }
      }
    }
    if (dataset.categories.subcategory === 'genderApplied') {
      if (dataset.categories.subsubcategory === 'men') {
        return {
          ...dataset,
          categories: {
            category: 'gender',
            subcategory: 'genderAppliedMen',
            subsubcategory: null
          }
        }
      } else {
        return {
          ...dataset,
          categories: {
            category: 'gender',
            subcategory: 'genderAppliedWomen',
            subsubcategory: null
          }
        }
      }
    }
    return dataset
  })
}
