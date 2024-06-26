import _ from 'lodash'
import type { KOTCourse, KOTInstitution } from 'parser'
import { formatData } from '$lib/utils/chartHelpers'

type NewKOT2DCategory = 'accepted' | 'applied' | 'quotient'
type NewKOT3DCategory = 'gender'
type NewKOT3DSubCategory = 'accepted' | 'applied'

type NewKOT2DDatasetCategory = {
  accepted: 'admitted' | 'standby'
  applied: 'total' | 'firstPriority'
  quotient: 'primary' | 'standby'
}

type NewKOT3DDatasetCategory = {
  gender: 'accepted' | 'applied'
}

type NewKOT3DDatasetSubcategory = {
  accepted: 'men' | 'women'
  applied: 'men' | 'women'
}

type NewKOTData = (string | number)[]

type NewKOT2DDataset<T extends NewKOT2DCategory> = Record<NewKOT2DDatasetCategory[T], NewKOTData> &
  { year: number }[]

type NewKOT3DSubDataset<T extends NewKOT3DSubCategory> = Record<
  NewKOT3DDatasetSubcategory[T],
  NewKOTData
> &
  { year: number }[]

type NewKOT3DDataset<T extends NewKOT3DCategory> = Record<
  NewKOT3DDatasetCategory[T],
  NewKOTDataCategory<NewKOT3DSubDataset<NewKOT3DDatasetCategory[T]>>
>

type NewKOTDataCategory<T> = {
  id: string
  unit: string
  datasets: T
}

type NewKOTDataCategories = {
  accepted?: NewKOTDataCategory<NewKOT2DDataset<'accepted'>>
  applied?: NewKOTDataCategory<NewKOT2DDataset<'applied'>>
  quotient?: NewKOTDataCategory<NewKOT2DDataset<'quotient'>>
  gender?: NewKOT3DDataset<'gender'>
}

export type NewKOTCourse = KOTCourse & {
  /** The different categories of data available for the course. */
  dataCategories: NewKOTDataCategories
}

export type NewKOTInstitution = KOTInstitution & {
  /** The different categories of data available for the institution. */
  dataCategories: NewKOTDataCategories
}

export function transformInstitutionsToNewFormat(
  institutions: Required<KOTInstitution>[]
): NewKOTInstitution[] {
  return institutions.map((institution) => ({
    ...institution,
    courses: institution.courses.map((course) => ({
      ...course,
      dataCategories: _.mapValues(_.groupBy(course.datasets, 'categories.category'), (datasets) => {
        if (!datasets[0].categories.subsubcategory) {
          return {
            unit: datasets[0].unit,
            datasets: formatData(datasets)
          }
        }

        return _.mapKeys(
          _.mapValues(_.groupBy(datasets, 'categories.subcategory'), (subDatasets) => ({
            unit: subDatasets[0].unit,
            datasets: formatData(subDatasets)
          })),
          (_, key) => (key === 'genderAccepted' ? 'accepted' : 'applied')
        )
      })
    })),
    dataCategories: _.mapValues(
      _.groupBy(institution.datasets, 'categories.category'),
      (datasets) => ({
        unit: datasets[0].unit,
        datasets: formatData(datasets)
      })
    )
  }))
}
