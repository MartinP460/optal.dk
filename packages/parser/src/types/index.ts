export type Unit = 'persons'
export type KOTLabel = 'accepted' | 'applied' | 'quotient'
export type KOTCategory = 'admitted' | 'standby' | 'total' | 'firstPriority' | 'primary'

export type KOTDataset = {
  id: number
  label: KOTLabel
  category: KOTCategory
  data: (string | number)[]
  max?: number
  unit?: Unit | null
}

export type KOTCourse = {
  /** The id of the course. */
  id: string
  /** All unique course names throughout the years. */
  courseNames: string[]
  /** All years where course data was available. */
  years: number[]
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
  /** All years where institution data was available. */
  years: number[]
  /** The datasets of the institution. */
  datasets: KOTDataset[]
  /** The courses the insitution offered since 2011. */
  courses: KOTCourse[]
  /** The most recent name of the institution. */
  latestName?: string
  /** The slug used to identify the institution. */
  slug?: string
}
