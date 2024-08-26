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
  ComputerScience = 'computerScience',
  Medicin = 'medicin',
  Pharmacy = 'pharmacy',
  VeterinaryMedicine = 'veterinaryMedicine',
  PublicHealth = 'publicHealth',
  Dentistry = 'dentistry',
  BiomedicalLaboratoryTechnologist = 'biomedicalLaboratoryTechnologist',
  OccupationalTherapist = 'occupationalTherapist',
  NutritionAndHealth = 'nutritionAndHealth'
}

export const groupings: Pick<KOTGrouping, 'name' | 'courseIds' | 'parentGroupings'>[] = [
  {
    name: GroupingName.ComputerScience,
    courseIds: ['25306', '22115', '10220', '17020'],
    parentGroupings: [ParentGroupingName.IT, ParentGroupingName.NaturalScience]
  },
  {
    name: GroupingName.Medicin,
    courseIds: ['25320', '22010', '10110', '10112', '17115', '17117'],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.Pharmacy,
    courseIds: ['10117', '17025'],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.VeterinaryMedicine,
    courseIds: ['10140', '22190'],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.PublicHealth,
    courseIds: ['22025', '10115', '20010', '17120'],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.Dentistry,
    courseIds: ['22015', '10120'],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.BiomedicalLaboratoryTechnologist,
    courseIds: [
      '40610',
      '40612',
      '40645',
      '40630',
      '40640',
      '40650t',
      '40610t',
      '40612t',
      '40660',
      '40690',
      '40692',
      '40670',
      '40650',
      '40652'
    ],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.OccupationalTherapist,
    courseIds: [
      '42020',
      '42022',
      '42045',
      '42040',
      '42060t',
      '42020t',
      '42022t',
      '42080',
      '42070',
      '42140',
      '42142',
      '42100',
      '42120',
      '42060',
      '42062'
    ],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.NutritionAndHealth,
    courseIds: [
      '45015',
      '45010',
      '45119',
      '45110',
      '45120',
      '45010t',
      '45015t',
      '45160',
      '45210',
      '45115',
      '45117'
    ],
    parentGroupings: [ParentGroupingName.Healthcare]
  }
]
