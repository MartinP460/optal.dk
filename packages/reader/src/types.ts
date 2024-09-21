import { GroupingName, ParentGroupingName } from './constants'

export type Unit = 'persons'

export type KOTId = string

export type KOTCourse = {
  /** The id of the course. */
  id: KOTId
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
  /** The institutions where this exact course has also been offered. */
  otherOfferedInstitutions: KOTId[]
}

export type KOTInstitution = {
  /** The id of the institution (note: they stopped using them in 2013). */
  id: KOTId
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

export type KOTCategory = 'accepted' | 'applied' | 'quotient' | 'gender' | 'age' | 'education'

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
  education:
    | 'edAcceptedUnknown'
    | 'edAcceptedSTX'
    | 'edAcceptedHF'
    | 'edAcceptedHHX'
    | 'edAcceptedHTX'
    | 'edAcceptedIB'
    | 'edAcceptedGIF'
    | 'edAcceptedEngineer'
    | 'edAcceptedEUD'
    | 'edAcceptedIBForeign'
    | 'edAcceptedForeign'
    | 'edAcceptedEUX'
    | 'edAcceptedEUXPartOne'
    | 'edAcceptedFaroese'
    | 'edAcceptedGreenlandic'
    | 'edAcceptedOther'
    | 'edAppliedUnknown'
    | 'edAppliedSTX'
    | 'edAppliedHF'
    | 'edAppliedHHX'
    | 'edAppliedHTX'
    | 'edAppliedIB'
    | 'edAppliedGIF'
    | 'edAppliedEngineer'
    | 'edAppliedEUD'
    | 'edAppliedIBForeign'
    | 'edAppliedForeign'
    | 'edAppliedEUX'
    | 'edAppliedEUXPartOne'
    | 'edAppliedFaroese'
    | 'edAppliedGreenlandic'
    | 'edAppliedOther'
}

export type KOTSubcategory = KOTDatasetCategory[keyof KOTDatasetCategory]
export type KOTSubcategoryAccepted = KOTDatasetCategory['accepted']
export type KOTSubcategoryApplied = KOTDatasetCategory['applied']
export type KOTSubcategoryQuotient = KOTDatasetCategory['quotient']
export type KOTSubcategoryGender = KOTDatasetCategory['gender']
export type KOTSubcategoryAge = KOTDatasetCategory['age']
export type KOTSubcategoryEducation = KOTDatasetCategory['education']

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
  education?: KOTDataCategoryGeneric<{
    year: number
    edAcceptedUnknown: KOTData
    edAcceptedSTX: KOTData
    edAcceptedHF: KOTData
    edAcceptedHHX: KOTData
    edAcceptedHTX: KOTData
    edAcceptedIB: KOTData
    edAcceptedGIF: KOTData
    edAcceptedEngineer: KOTData
    edAcceptedEUD: KOTData
    edAcceptedIBForeign: KOTData
    edAcceptedForeign: KOTData
    edAcceptedEUX: KOTData
    edAcceptedEUXPartOne: KOTData
    edAcceptedFaroese: KOTData
    edAcceptedGreenlandic: KOTData
    edAcceptedOther: KOTData
    edAppliedUnknown: KOTData
    edAppliedSTX: KOTData
    edAppliedHF: KOTData
    edAppliedHHX: KOTData
    edAppliedHTX: KOTData
    edAppliedIB: KOTData
    edAppliedGIF: KOTData
    edAppliedEngineer: KOTData
    edAppliedEUD: KOTData
    edAppliedIBForeign: KOTData
    edAppliedForeign: KOTData
    edAppliedEUX: KOTData
    edAppliedEUXPartOne: KOTData
    edAppliedFaroese: KOTData
    edAppliedGreenlandic: KOTData
    edAppliedOther: KOTData
  }>
}

export type KOTDataCategory = NonNullable<KOTDataCategories[keyof KOTDataCategories]>

export type KOTGrouping = {
  /** The ID of the grouping. */
  id: string
  /** The sum of properties in each dataset of each data category for the particular group of courses. */
  dataCategories: KOTDataCategories
  /** The name of the grouping (i.e. computer science or biology). */
  name: GroupingName
  /** The slug associated with the grouping. */
  slug: string
  /** The ID of courses included in the grouping. */
  courseIds: KOTId[]
  /** The number of courses in the grouping. Equivalent to the length of courseIds. */
  courseCount: number
  /** The earliest and latest of year of recorded data across courses in the grouping. */
  period: number[]
  /** The parent grouping that the grouping is a part of (e.g. IT for computer science). */
  parentGroupings: ParentGroupingName[]
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type KOTInstitutionPartial = Omit<KOTInstitution, 'courses'> & {
  courses: PartialBy<KOTCourse, 'otherOfferedInstitutions'>[]
}
