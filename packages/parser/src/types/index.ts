export type Unit = 'persons'

export type KOTCourse = {
  /** The id of the course. */
  id: string
  /** All unique course names throughout the years. */
  courseNames: string[]
  /** The different categories of data available for the course. */
  dataCategories: KOTDataCategories
  /** The most recent name of the course. */
  latestName: string
  /** Whether the course starts in the winter or summer. */
  studyStart?: 'winterstart' | 'summerstart' | null
  /** Whether the course is taken online ("e-learning"). Null if no course meta-data was present. */
  eLearning?: boolean | null
  /** The city the course takes place in. */
  location?: string | null
  /** The slug used to identify the course. */
  slug: string
  /** The time period in which the course has been active. */
  period: number[]
}

export type KOTInstitution = {
  /** The id of the institution (note: they stopped using them in 2013). */
  id: string
  /** All names that the institution has had since 2011. */
  institutionNames: string[]
  /** The different categories of data available for the course. */
  dataCategories: KOTDataCategories
  /** The courses the insitution offered since 2011. */
  courses: KOTCourse[]
  /** The most recent name of the institution. */
  latestName: string
  /** The slug used to identify the institution. */
  slug: string
  /** The time period in which the institution has been active. */
  period: number[]
}

export type KOTCategory = 'accepted' | 'applied' | 'quotient' | 'gender' | 'age'

export type KOTSubcategoryGeneric<T extends KOTCategory> = Omit<
  keyof NonNullable<KOTDataCategories[T]>['datasets'][number],
  'year'
>

type KOTDatasetCategory = {
  accepted: 'acceptedAdmitted' | 'acceptedStandby'
  applied: 'appliedTotal' | 'appliedFirstpriority'
  quotient: 'quotientPrimary' | 'quotientStandby'
  gender: 'genderAcceptedMen' | 'genderAcceptedWomen' | 'genderAppliedMen' | 'genderAppliedWomen'
  age:
    | 'ageAcceptedYounger'
    | 'ageAccepted19'
    | 'ageAccepted20'
    | 'ageAccepted21'
    | 'ageAccepted22'
    | 'ageAccepted23'
    | 'ageAccepted24'
    | 'ageAccepted25'
    | 'ageAccepted26To30'
    | 'ageAcceptedOlder'
    | 'ageAppliedYounger'
    | 'ageApplied19'
    | 'ageApplied20'
    | 'ageApplied21'
    | 'ageApplied22'
    | 'ageApplied23'
    | 'ageApplied24'
    | 'ageApplied25'
    | 'ageApplied26To30'
    | 'ageAppliedOlder'
}

export type KOTSubcategory = KOTDatasetCategory[keyof KOTDatasetCategory]

export type KOTData = string | number

type KOTDataCategoryGeneric<T> = {
  name: KOTCategory
  unit: Unit | null
  datasets: T[]
}

export type KOTDataCategories = {
  accepted?: KOTDataCategoryGeneric<{
    year: number
    acceptedAdmitted: KOTData
    acceptedStandby: KOTData
  }>
  applied?: KOTDataCategoryGeneric<{
    year: number
    appliedTotal: KOTData
    appliedFirstpriority: KOTData
  }>
  quotient?: KOTDataCategoryGeneric<{
    year: number
    quotientPrimary: KOTData
    quotientStandby: KOTData
  }>
  gender?: KOTDataCategoryGeneric<{
    year: number
    genderAcceptedMen: KOTData
    genderAcceptedWomen: KOTData
    genderAppliedMen: KOTData
    genderAppliedWomen: KOTData
  }>
  age?: KOTDataCategoryGeneric<{
    year: number
    ageAcceptedYounger: KOTData
    ageAccepted19: KOTData
    ageAccepted20: KOTData
    ageAccepted21: KOTData
    ageAccepted22: KOTData
    ageAccepted23: KOTData
    ageAccepted24: KOTData
    ageAccepted25: KOTData
    ageAccepted26To30: KOTData
    ageAcceptedOlder: KOTData
    ageAppliedYounger: KOTData
    ageApplied19: KOTData
    ageApplied20: KOTData
    ageApplied21: KOTData
    ageApplied22: KOTData
    ageApplied23: KOTData
    ageApplied24: KOTData
    ageApplied25: KOTData
    ageApplied26To30: KOTData
    ageAppliedOlder: KOTData
  }>
}

export type KOTDataCategory = NonNullable<KOTDataCategories[keyof KOTDataCategories]>
