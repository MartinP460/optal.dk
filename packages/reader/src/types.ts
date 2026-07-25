import _ from 'lodash'
import { GroupingName, ParentGroupingName } from './groupings'

export type DB = {
  courses: KOTCourse[]
  institutions: KOTInstitution[]
  groupings: KOTGrouping[]
  institutionCourses: KOTInstitutionCourses[]
  data: KOTData[]
}

/** A random uuid. */
export type ForeignKey = string
/** The official KOT ID of a course. */
export type KOTId = string

export type KOTData = {
  /** A random uuid that uniquely identifies the entry. */
  id: string
  /** The ID of the course, institution or grouping that the data pertains to. */
  foreignKeyId: ForeignKey
  /** An array of objects where each object represents one year of data. */
  data: Array<
    {
      year: number
    } & KOTDataTypes
  >
}

export type KOTInstitution = {
  /** A random uuid that uniquely identifies the entry. */
  id: ForeignKey
  /** The offical KOT ID of the institution (note: KOT officially stopped using them in 2013). */
  KOTId: KOTId
  /** All names that the institution has had since 2011. */
  institutionNames: string[]
  /** The most recent name of the institution. */
  latestName: string
  /** The slug used to identify the institution. */
  slug: string
  /** The first and last active years of the institution. */
  period: [number, number]
}

export type KOTInstitutionCourses = {
  /** A random uuid that uniquely identifies the entry. */
  id: string
  /** The KOT ID of the institution. */
  KOTInstitutionId: KOTId
  /** The KOT ID of the course. */
  KOTCourseId: KOTId
  /** The first and last year that the course was offered by the institution. */
  period: [number, number]
}

export type KOTCourse = {
  /** A random uuid that uniquely identifies the entry. */
  id: ForeignKey
  /** The ID of the course. */
  KOTId: KOTId
  /** All unique course names throughout the years. */
  courseNames: string[]
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
  period: [number, number]
}

export type KOTGrouping = {
  /** A random uuid that uniquely identifies the grouping. */
  id: ForeignKey
  /** The name of the grouping (i.e. computer science or biology). */
  name: GroupingName
  /** The slug associated with the grouping. */
  slug: string
  /** The ID of courses included in the grouping. */
  courseIds: KOTId[]
  /** The earliest and latest of year of recorded data across courses in the grouping. */
  period: [number, number]
  /** The parent grouping that the grouping is a part of (e.g. IT for computer science). */
  parentGroupings: ParentGroupingName[]
}

export type KOTDataTypes = {
  [K in KOTDataPointKeys]?: K extends
    KOTDataPointKeys.QuotientPrimary | KOTDataPointKeys.QuotientStandby
    ? string
    : number
}

export enum KOTDataPointKeys {
  AcceptedAdmitted = 'acceptedAdmitted',
  AcceptedStandby = 'acceptedStandby',
  AppliedTotal = 'appliedTotal',
  AppliedFirstpriority = 'appliedFirstpriority',
  QuotientPrimary = 'quotientPrimary',
  QuotientStandby = 'quotientStandby',
  GenderAcceptedMen = 'genderAcceptedMen',
  GenderAcceptedWomen = 'genderAcceptedWomen',
  GenderAppliedMen = 'genderAppliedMen',
  GenderAppliedWomen = 'genderAppliedWomen',
  AgeAcceptedYounger = 'ageAcceptedYounger',
  AgeAccepted19 = 'ageAccepted19',
  AgeAccepted20 = 'ageAccepted20',
  AgeAccepted21 = 'ageAccepted21',
  AgeAccepted22 = 'ageAccepted22',
  AgeAccepted23 = 'ageAccepted23',
  AgeAccepted24 = 'ageAccepted24',
  AgeAccepted25 = 'ageAccepted25',
  AgeAccepted26To30 = 'ageAccepted26To30',
  AgeAcceptedOlder = 'ageAcceptedOlder',
  AgeAppliedYounger = 'ageAppliedYounger',
  AgeApplied19 = 'ageApplied19',
  AgeApplied20 = 'ageApplied20',
  AgeApplied21 = 'ageApplied21',
  AgeApplied22 = 'ageApplied22',
  AgeApplied23 = 'ageApplied23',
  AgeApplied24 = 'ageApplied24',
  AgeApplied25 = 'ageApplied25',
  AgeApplied26To30 = 'ageApplied26To30',
  AgeAppliedOlder = 'ageAppliedOlder',
  EdAcceptedUnknown = 'edAcceptedUnknown',
  EdAcceptedSTX = 'edAcceptedSTX',
  EdAcceptedHF = 'edAcceptedHF',
  EdAcceptedHHX = 'edAcceptedHHX',
  EdAcceptedHTX = 'edAcceptedHTX',
  EdAcceptedIB = 'edAcceptedIB',
  EdAcceptedGIF = 'edAcceptedGIF',
  EdAcceptedEngineer = 'edAcceptedEngineer',
  EdAcceptedEUD = 'edAcceptedEUD',
  EdAcceptedOther = 'edAcceptedOther',
  EdAcceptedIBForeign = 'edAcceptedIBForeign',
  EdAcceptedForeign = 'edAcceptedForeign',
  EdAcceptedEUX = 'edAcceptedEUX',
  EdAcceptedEUXPartOne = 'edAcceptedEUXPartOne',
  EdAcceptedFaroese = 'edAcceptedFaroese',
  EdAcceptedGreenlandic = 'edAcceptedGreenlandic',
  EdAppliedUnknown = 'edAppliedUnknown',
  EdAppliedSTX = 'edAppliedSTX',
  EdAppliedHF = 'edAppliedHF',
  EdAppliedHHX = 'edAppliedHHX',
  EdAppliedHTX = 'edAppliedHTX',
  EdAppliedIB = 'edAppliedIB',
  EdAppliedGIF = 'edAppliedGIF',
  EdAppliedEngineer = 'edAppliedEngineer',
  EdAppliedEUD = 'edAppliedEUD',
  EdAppliedOther = 'edAppliedOther',
  EdAppliedIBForeign = 'edAppliedIBForeign',
  EdAppliedForeign = 'edAppliedForeign',
  EdAppliedEUX = 'edAppliedEUX',
  EdAppliedEUXPartOne = 'edAppliedEUXPartOne',
  EdAppliedFaroese = 'edAppliedFaroese',
  EdAppliedGreenlandic = 'edAppliedGreenlandic'
}

export const KOTDataType: {
  [K in KOTDataPointKeys]: K extends
    KOTDataPointKeys.QuotientPrimary | KOTDataPointKeys.QuotientStandby
    ? 'string'
    : 'number'
} = {
  ...(_.fromPairs(Object.values(KOTDataPointKeys).map((key) => [key, 'number'])) as {
    [K in KOTDataPointKeys]: 'number'
  }),
  [KOTDataPointKeys.QuotientPrimary]: 'string',
  [KOTDataPointKeys.QuotientStandby]: 'string'
}
