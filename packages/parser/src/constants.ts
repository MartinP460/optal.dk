import { KOTGrouping } from './types'

export const AVAILABLE_YEARS = [
  2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024
] as const

export const LATEST_YEAR = 2024

export enum ParentGroupingName {
  Healthcare = 'healthcare',
  HumanitiesAndDesign = 'humanitiesAndDesign',
  IT = 'it',
  NaturalScience = 'naturalScience',
  SocialScience = 'socialScience',
  Technical = 'technical'
}

export enum GroupingName {
  Datalogi = 'datalogi'
}

export const groupings: Pick<KOTGrouping, 'name' | 'courseIds' | 'parentGroupings'>[] = [
  {
    name: GroupingName.Datalogi,
    courseIds: ['25306', '22115', '10220', '17020'],
    parentGroupings: [ParentGroupingName.IT, ParentGroupingName.NaturalScience]
  }
]
