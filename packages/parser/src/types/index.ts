export type Unit = 'persons'
export type KOTCategory = 'accepted' | 'applied' | 'quotient' | 'gender'
export type KOTSubCategory =
  | 'admitted'
  | 'standby'
  | 'total'
  | 'firstPriority'
  | 'primary'
  | 'genderAccepted'
  | 'genderApplied'
export type KOTSubSubCategory = 'men' | 'women'

type KOTCategoriesAccepted = {
  category: 'accepted'
  subcategory: 'admitted' | 'standby'
  subsubcategory: null
}

type KOTCategoriesApplied = {
  category: 'applied'
  subcategory: 'total' | 'firstPriority'
  subsubcategory: null
}

type KOTCategoriesQuotient = {
  category: 'quotient'
  subcategory: 'primary' | 'standby'
  subsubcategory: null
}

type KOTCategoriesGenderAccepted = {
  category: 'gender'
  subcategory: 'genderAccepted'
  subsubcategory: 'men' | 'women'
}

type KOTCategoriesGenderApplied = {
  category: 'gender'
  subcategory: 'genderApplied'
  subsubcategory: 'men' | 'women'
}

export type KOTDataset = {
  id: number
  categories:
    | KOTCategoriesAccepted
    | KOTCategoriesApplied
    | KOTCategoriesQuotient
    | KOTCategoriesGenderAccepted
    | KOTCategoriesGenderApplied
  years: number[]
  data: (string | number)[]
  unit?: Unit | null
}

export type KOTCourse = {
  /** The id of the course. */
  id: string
  /** All unique course names throughout the years. */
  courseNames: string[]
  /** The datasets of the course. */
  datasets: KOTDataset[]
  /** The most recent name of the course. */
  latestName?: string
  /** Whether the course starts in the winter or summer. */
  studyStart?: 'winterstart' | 'summerstart' | null
  /** Whether the course is taken online ("e-learning"). Null if no course meta-data was present. */
  eLearning?: boolean | null
  /** The city the course takes place in. */
  location?: string | null
  /** The slug used to identify the course. */
  slug?: string
}

export type KOTInstitution = {
  /** The id of the institution (note: they stopped using them in 2013). */
  id: string
  /** All names that the institution has had since 2011. */
  institutionNames: string[]
  /** The datasets of the institution. */
  datasets: KOTDataset[]
  /** The courses the insitution offered since 2011. */
  courses: KOTCourse[]
  /** The most recent name of the institution. */
  latestName?: string
  /** The slug used to identify the institution. */
  slug?: string
}
