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
  SocialScience = 'socialScienceAndEconomics',
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
  PhysicalEducation = 'physicalEducation',
  BusinessAdministrationAndCommercialLaw = 'businessAdministrationAndCommercialLaw',
  BusinessAdministration = 'businessAdminstration',
  Economics = 'economics',
  Law = 'law',
  SocialScience = 'socialScience',
  Sociology = 'sociology',
  PoliticalScience = 'politicalScience',
  Anthropology = 'anthropology',
  Psychology = 'psychology',
  Education = 'educationScience',
  PublicAdministration = 'publicAdministration',
  Taxation = 'taxation',
  SocialWorker = 'socialWork',
  FinancialManagementAndService = 'financialManagementAndService',
  FinancialController = 'financialController',
  FinancialManagement = 'financialManagement',
  CommerceManagement = 'commerceManagement',
  LogisticsManagement = 'logisticsManagement',
  MarketingManagement = 'marketingManagement',
  ServiceHospitalityTourismManagement = 'serviceHospitalityTourismManagement',
  AdministrativeManagement = 'administrativeManagement',
  HealthcareAdministration = 'healthcareAdministration',
  BiotechnologyCivilEngineer = 'biotechnologyCivilEngineer',
  UrbanEnergyEnvironmentalPlanningCivilEngineer = 'urbanEnergyEnvironmentalPlanningCivilEngineer',
  ComputerTechnologyCivilEngineer = 'computerTechnologyCivilEngineer',
  EnergyEngineeringCivilEngineer = 'energyEngineeringCivilEngineer',
  PhysicsAndTechnologyCivilEngineer = 'physicsAndTechnologyCivilEngineer',
  ChemistryAndTechnologyCivilEngineer = 'chemistryAndTechnologyCivilEngineer',
  MechanicalEngineeringCivilEngineer = 'mechanicalEngineeringCivilEngineer',
  RobotSystemsCivilEngineer = 'robotSystemsCivilEngineer',
  SoftwareCivilEngineer = 'softwareCivilEngineer',
  Danish = 'danish',
  Philosophy = 'philosophy',
  History = 'history',
  ClassicalArchaeology = 'classicalArchaeology',
  ArtHistory = 'artHistory',
  LiteraryScience = 'literaryScience',
  MediaStudies = 'mediaStudies',
  Musicology = 'musicology',
  ReligiousStudies = 'religiousStudies'
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
  },

  /*
  SOCIAL SCIENCE EDUCATIONS
  */

  {
    name: GroupingName.BusinessAdministrationAndCommercialLaw,
    courseIds: ['22650', '13020', '25715', '17520'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.BusinessAdministration,
    courseIds: ['25710', '22610', '22930', '13010', '20530', '17510', '18210', '20210'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.Economics,
    courseIds: ['25625', '22430', '10430', '17420'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.Law,
    courseIds: ['25630', '22415', '10410', '17410', '20410'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.SocialScience,
    courseIds: ['25612', '22422', '10415', '17412'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.Sociology,
    courseIds: ['25620', '10435'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.PoliticalScience,
    courseIds: ['22425', '10420', '17415'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.Anthropology,
    courseIds: ['22225', '10440'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.Psychology,
    courseIds: ['25435', '22420', '10368', '17200'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.PublicAdministration,
    courseIds: [
      '52610',
      '52612',
      '52667',
      '52665',
      '52660',
      '52620t',
      '52625t',
      '52610t',
      '52612t',
      '52627',
      '52630',
      '52650',
      '52645',
      '52643',
      '52640',
      '52625',
      '52622',
      '52620'
    ],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.Taxation,
    courseIds: ['52710', '54710t', '54790', '54990', '54810', '54811', '54830', '54831', '54910'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.SocialWorker,
    courseIds: [
      '25810',
      '55020',
      '55010',
      '55012',
      '55017',
      '55019',
      '55057',
      '55052',
      '55030',
      '55032',
      '55040',
      '55042',
      '55050',
      '55055',
      '55110t',
      '55120t',
      '55140t',
      '55010t',
      '55012t',
      '55017t',
      '55019t',
      '55020t',
      '55210',
      '55213',
      '55220',
      '55225',
      '55310',
      '55313',
      '55320',
      '55110',
      '55120',
      '55130',
      '55131',
      '55140',
      '55142'
    ],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.FinancialManagementAndService,
    courseIds: [
      '45860',
      '45890',
      '45850',
      '45845',
      '45846',
      '45810',
      '45830t',
      '45840',
      '45880',
      '45830',
      '45820'
    ],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.FinancialController,
    courseIds: ['74450', '74410', '74400', '74414', '74430t', '74448', '74446', '74460', '74430'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.FinancialManagement,
    courseIds: [
      '74110',
      '74210',
      '74215',
      '74216',
      '74217',
      '74090',
      '74100',
      '74080',
      '74084',
      '74015',
      '74020',
      '74010',
      '74011',
      '74022',
      '74024',
      '74060t',
      '74072',
      '74070',
      '74071',
      '74160',
      '74165',
      '74060',
      '74062',
      '74028',
      '74030',
      '74032'
    ],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.CommerceManagement,
    courseIds: [
      '74682',
      '74660',
      '74662',
      '74670',
      '74672',
      '74675',
      '74680',
      '74681',
      '74605',
      '74607',
      '74625t',
      '74630t',
      '74625',
      '74630',
      '74612',
      '74610'
    ],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.LogisticsManagement,
    courseIds: ['87110', '87010', '87060t', '87060', '87030'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.MarketingManagement,
    courseIds: [
      '79410',
      '79562',
      '79510',
      '79560',
      '79563',
      '79360',
      '79290',
      '79310',
      '79311',
      '79012',
      '79062',
      '79060',
      '79010',
      '79011',
      '79068',
      '79210t',
      '79262',
      '79260',
      '79261',
      '79620',
      '79610',
      '79611',
      '79460',
      '79210',
      '79210',
      '79212',
      '79160',
      '79161',
      '79162',
      '79163',
      '79168',
      '79180'
    ],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.ServiceHospitalityTourismManagement,
    courseIds: [
      '86162',
      '86170',
      '86060',
      '86066',
      '86070',
      '86110t',
      '86130t',
      '86118',
      '86084',
      '86012',
      '86156',
      '86160',
      '86164',
      '86166',
      '86150',
      '86114',
      '86120',
      '86010',
      '86011',
      '86210',
      '86212',
      '86220',
      '86110',
      '86112',
      '86130',
      '86080',
      '86090',
      '86091',
      '86092'
    ],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.AdministrativeManagement,
    courseIds: ['70212', '70210', '70200', '70010', '70010t', '70060', '70020'],
    parentGroupings: [ParentGroupingName.SocialScience]
  },
  {
    name: GroupingName.HealthcareAdministration,
    courseIds: [
      '89010',
      '89012',
      '89026',
      '89030',
      '89046',
      '89050',
      '89090',
      '89092',
      '89080',
      '89086',
      '89060',
      '89062',
      '89070'
    ],
    parentGroupings: [ParentGroupingName.SocialScience, ParentGroupingName.Healthcare]
  },

  /*
  TECHNICAL EDUCATIONS
  */

  {
    name: GroupingName.BiotechnologyCivilEngineer,
    courseIds: ['25017', '15010', '22131'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.UrbanEnergyEnvironmentalPlanningCivilEngineer,
    courseIds: ['25055', '25070'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ComputerTechnologyCivilEngineer,
    courseIds: ['25025', '22136'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.EnergyEngineeringCivilEngineer,
    courseIds: ['25075', '26513'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.PhysicsAndTechnologyCivilEngineer,
    courseIds: ['25053', '17875'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ChemistryAndTechnologyCivilEngineer,
    courseIds: ['15035', '25047', '22132'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.MechanicalEngineeringCivilEngineer,
    courseIds: ['22138', '17882', '25040'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.RobotSystemsCivilEngineer,
    courseIds: ['25057', '17870'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.SoftwareCivilEngineer,
    courseIds: ['25060', '25062'],
    parentGroupings: [ParentGroupingName.Technical, ParentGroupingName.IT]
  },

  /*
  HUMANITIES AND DESIGN EDUCATIONS
  */

  {
    name: GroupingName.Danish,
    courseIds: ['25410', '10306', '17210', '22335'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.Philosophy,
    courseIds: ['22230', '10316', '17220', '25405'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.History,
    courseIds: ['25615', '22255', '10332', '17235', '18025'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.ClassicalArchaeology,
    courseIds: ['22290', '10344'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.ArtHistory,
    courseIds: ['22300', '10348'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.LiteraryScience,
    courseIds: ['10352', '17240'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.MediaStudies,
    courseIds: ['22320', '17250'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.Musicology,
    courseIds: ['22330', '10354'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.ReligiousStudies,
    courseIds: ['22340', '10372', '17260'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  }
]
