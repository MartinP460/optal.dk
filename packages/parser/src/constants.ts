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
  NutritionAndHealth = 'nutritionAndHealth',
  Physiotherapist = 'physiotherapist',
  Midwife = 'midwife',
  Optometry = 'optometry',
  PsychomotorTherapist = 'psychomotorTherapist',
  Radiographer = 'radiographer',
  Nurse = 'nurse',
  DentalHygienist = 'dentalHygienist',
  Biology = 'biology',
  Geology = 'geology',
  Physics = 'physics',
  Chemistry = 'chemistry',
  Mathematics = 'mathematics',
  MathematicsEconomics = 'mathematicsEconomics',
  Medialogy = 'medialogy',
  MedicinalChemistry = 'medicinalChemistry',
  Nanoscience = 'nanoscience',
  PhysicalEducation = 'physicalEducation'
}

export const groupings: Pick<KOTGrouping, 'name' | 'courseIds' | 'parentGroupings'>[] = [
  /*
  HEALTHCARE EDUCATIONS
  */

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
  },
  {
    name: GroupingName.Physiotherapist,
    courseIds: [
      '47020',
      '47022',
      '47040',
      '47045',
      '47065',
      '47067',
      '47062',
      '47050',
      '47052',
      '47060',
      '47080t',
      '47020t',
      '47022t',
      '47100',
      '47105',
      '47110',
      '47040t',
      '47045t',
      '47160',
      '47162',
      '47120',
      '47140',
      '47080',
      '47082'
    ],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.Midwife,
    courseIds: ['50010', '50012', '50030', '50032', '50010t', '50012t', '50015', '50020', '50022'],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.Optometry,
    courseIds: ['52750', '52753', '52710'],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.PsychomotorTherapist,
    courseIds: ['40010', '40010t', '40060'],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.Radiographer,
    courseIds: [
      '54020',
      '54022',
      '54030',
      '54040t',
      '54020t',
      '54022t',
      '54060',
      '54062',
      '54040',
      '54042'
    ],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.Nurse,
    courseIds: [
      '56100t',
      '56082',
      '56087',
      '56020',
      '56022',
      '56040',
      '56042',
      '56080',
      '56085',
      '56100',
      '56105',
      '56182',
      '56120',
      '56122',
      '56140',
      '56142',
      '56145',
      '56147',
      '56150',
      '56152',
      '56160',
      '56162',
      '56180',
      '56200t',
      '56220t',
      '56280t',
      '56020t',
      '56022t',
      '56040t',
      '56042t',
      '56240',
      '56230',
      '56237',
      '56260',
      '56080t',
      '56082t',
      '56085t',
      '56087t',
      '56100tt',
      '56105t',
      '56390',
      '56420',
      '56422',
      '56440',
      '56442',
      '56443',
      '56345',
      '56320',
      '56290',
      '56300',
      '56340',
      '56360',
      '56370',
      '56380',
      '56385',
      '56400',
      '56200',
      '56202',
      '56220',
      '56222',
      '56280',
      '56282'
    ],
    parentGroupings: [ParentGroupingName.Healthcare]
  },
  {
    name: GroupingName.DentalHygienist,
    courseIds: ['22020', '10160'],
    parentGroupings: [ParentGroupingName.Healthcare]
  },

  /*
  SCIENCE EDUCATIONS
  */

  {
    name: GroupingName.Biology,
    courseIds: ['25305', '22110', '10250', '17010'],
    parentGroupings: [ParentGroupingName.NaturalScience]
  },
  {
    name: GroupingName.Geology,
    courseIds: ['22125', '10275'],
    parentGroupings: [ParentGroupingName.NaturalScience]
  },
  {
    name: GroupingName.Physics,
    courseIds: ['25307', '22120', '10230', '17070'],
    parentGroupings: [ParentGroupingName.NaturalScience]
  },
  {
    name: GroupingName.Chemistry,
    courseIds: ['25313', '22135', '10286', '17085'],
    parentGroupings: [ParentGroupingName.NaturalScience]
  },
  {
    name: GroupingName.Mathematics,
    courseIds: ['25314', '22140', '10287', '17064'],
    parentGroupings: [ParentGroupingName.NaturalScience]
  },
  {
    name: GroupingName.MathematicsEconomics,
    courseIds: ['25319', '22145', '10288', '17050'],
    parentGroupings: [ParentGroupingName.NaturalScience]
  },
  {
    name: GroupingName.ComputerScience,
    courseIds: ['25306', '22115', '10220', '17020'],
    parentGroupings: [ParentGroupingName.NaturalScience, ParentGroupingName.IT]
  },
  {
    name: GroupingName.Medialogy,
    courseIds: ['25321', '25322', '26520', '25315', '25317'],
    parentGroupings: [ParentGroupingName.NaturalScience, ParentGroupingName.IT]
  },
  {
    name: GroupingName.MedicinalChemistry,
    courseIds: ['22150', '10293'],
    parentGroupings: [ParentGroupingName.NaturalScience]
  },
  {
    name: GroupingName.Nanoscience,
    courseIds: ['22160', '10290'],
    parentGroupings: [ParentGroupingName.NaturalScience]
  },
  {
    name: GroupingName.PhysicalEducation,
    courseIds: ['25325', '22130', '17040', '10285'],
    parentGroupings: [ParentGroupingName.NaturalScience]
  }
]
