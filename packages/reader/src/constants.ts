import { KOTGrouping } from './types'

export const AVAILABLE_YEARS = [
  2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024
] as const

export const LATEST_YEAR = 2024

export enum ParentGroupingName {
  EconomicsAndBusiness = 'economicsAndBusiness',
  Healthcare = 'healthcare',
  HumanitiesAndDesign = 'humanitiesAndDesign',
  IT = 'it',
  NaturalScience = 'naturalScience',
  SocialScience = 'socialScienceEducations',
  Technical = 'technical'
}

export enum GroupingName {
  AdministrativeManagement = 'administrativeManagement',
  AgroBusinessLandscapeManagement = 'agroBusinessLandscapeManagement',
  Anthropology = 'anthropology',
  ArchitecturalEngineeringBSEngineering = 'architecturalEngineeringBSEngineering',
  ArchitecturalTechnologyConstructionManagement = 'architecturalTechnologyConstructionManagement',
  ArtHistory = 'artHistory',
  AutomationEngineering = 'automationEngineering',
  AutomotiveTechnology = 'automotiveTechnology',
  Biology = 'biology',
  BiomedicalLaboratoryTechnologist = 'biomedicalLaboratoryTechnologist',
  BiotechnologyBSEngineering = 'biotechnologyBSEngineering',
  BiotechnologyCivilEngineer = 'biotechnologyCivilEngineer',
  BusinessAdministration = 'businessAdminstration',
  BusinessAdministrationAndCommercialLaw = 'businessAdministrationAndCommercialLaw',
  ChemicalEngineeringBSEngineering = 'chemicalEngineeringBSEngineering',
  Chemistry = 'chemistry',
  ChemistryAndTechnologyCivilEngineer = 'chemistryAndTechnologyCivilEngineer',
  ChinaStudies = 'chinaStudies',
  ClassicalArchaeology = 'classicalArchaeology',
  CommerceManagement = 'commerceManagement',
  ComputerScience = 'computerScience',
  ComputerScienceAP = 'computerScienceAP',
  ComputerTechnologyCivilEngineer = 'computerTechnologyCivilEngineer',
  ConstructionBusinessConstructionCoordinator = 'constructionBusinessConstructionCoordinator',
  Danish = 'danish',
  DentalHygienist = 'dentalHygienist',
  Dentistry = 'dentistry',
  DesignTechnologyBusiness = 'designTechnologyBusiness',
  Economics = 'economics',
  Education = 'educationScience',
  ElectricalEnergyTechnologyBSEngineering = 'electricalEnergyTechnologyBSEngineering',
  Electrician = 'electrician',
  ElectronicsBSEngineering = 'electronicsBSEngineering',
  EnergyEngineeringCivilEngineer = 'energyEngineeringCivilEngineer',
  EnergyTechnology = 'energyTechnology',
  English = 'english',
  FinancialController = 'financialController',
  FinancialManagement = 'financialManagement',
  FinancialManagementAndService = 'financialManagementAndService',
  French = 'french',
  Geology = 'geology',
  German = 'german',
  HealthcareAdministration = 'healthcareAdministration',
  History = 'history',
  IndianSouthAsianStudies = 'indiaSouthAsiaStudies',
  ITArchitecture = 'itArchitecture',
  ITTechnology = 'itTechnology',
  JapanStudies = 'japanStudies',
  LaboratoryTechnician = 'laboratoryTechnician',
  Law = 'law',
  Linguistics = 'linguistics',
  LiteraryScience = 'literaryScience',
  LogisticManagement = 'logisticManagement',
  ManagementTechnologyOffshore = 'managementTechnologyOffshore',
  ManufacturingManagementBSEngineering = 'manufacturingManagementBSEngineering',
  MaritimeTransportNauticalScience = 'maritimeTransportNauticalScience',
  MarketingManagement = 'marketingManagement',
  Mathematics = 'mathematics',
  MathematicsEconomics = 'mathematicsEconomics',
  MechanicalEngineeringBSEngineering = 'mechanicalEngineeringBSEngineering',
  MechanicalEngineeringCivilEngineer = 'mechanicalEngineeringCivilEngineer',
  Medialogy = 'medialogy',
  MediaStudies = 'mediaStudies',
  Medicin = 'medicin',
  MedicinalChemistry = 'medicinalChemistry',
  Midwife = 'midwife',
  MultimediaDesign = 'multimediaDesign',
  Musicology = 'musicology',
  Nanoscience = 'nanoscience',
  Nurse = 'nurse',
  NutritionAndHealth = 'nutritionAndHealth',
  NutritionAndTechnology = 'nutritionAndTechnology',
  OccupationalTherapist = 'occupationalTherapist',
  Optometry = 'optometry',
  Pharmacy = 'pharmacy',
  Philosophy = 'philosophy',
  PhysicalEducation = 'physicalEducation',
  Physics = 'physics',
  PhysicsAndTechnologyCivilEngineer = 'physicsAndTechnologyCivilEngineer',
  Physiotherapist = 'physiotherapist',
  PoliticalScience = 'politicalScience',
  ProductionTechnology = 'productionTechnology',
  Psychology = 'psychology',
  PsychomotorTherapist = 'psychomotorTherapist',
  PublicAdministration = 'publicAdministration',
  PublicHealth = 'publicHealth',
  Radiographer = 'radiographer',
  ReligiousStudies = 'religiousStudies',
  RobotSystemsCivilEngineer = 'robotSystemsCivilEngineer',
  ServiceEngineeringPlumbingTechnology = 'serviceEngineeringPlumbingTechnology',
  ServiceHospitalityTourismManagement = 'serviceHospitalityTourismManagement',
  SocialScience = 'socialScience',
  SocialWorker = 'socialWork',
  Sociology = 'sociology',
  SoftwareCivilEngineer = 'softwareCivilEngineer',
  SoftwareTechnologyBSEngineering = 'softwareTechnologyBSEngineering',
  Spanish = 'spanish',
  SurveyingAndMapping = 'surveyingAndMapping',
  SustainableEnergyEngineeringBSEngineering = 'sustainableEnergyEngineeringBSEngineering',
  Taxation = 'taxation',
  TechnologyManagementMarineEngineering = 'technologyManagementMarineEngineering',
  UrbanEnergyEnvironmentalPlanningCivilEngineer = 'urbanEnergyEnvironmentalPlanningCivilEngineer',
  VeterinaryMedicine = 'veterinaryMedicine'
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
    parentGroupings: [ParentGroupingName.SocialScience, ParentGroupingName.EconomicsAndBusiness]
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
  {
    name: GroupingName.BiotechnologyBSEngineering,
    courseIds: ['22810', '48500', '48505'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ArchitecturalEngineeringBSEngineering,
    courseIds: ['22820', '22825', '15220', '25240', '26630', '15120', '17815'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.SustainableEnergyEngineeringBSEngineering,
    courseIds: ['48013', '25250', '26635', '15117', '15325', '48213'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ElectricalEnergyTechnologyBSEngineering,
    courseIds: ['22875', '22870', '22970', '15170', '17850', '49035', '49135', '48045'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ElectronicsBSEngineering,
    courseIds: ['26640', '25260', '22955', '22840', '22845', '17820', '19112'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ChemicalEngineeringBSEngineering,
    courseIds: ['25230', '26620', '17825', '15135'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.MechanicalEngineeringBSEngineering,
    courseIds: [
      '25270',
      '26650',
      '22960',
      '22860',
      '22865',
      '15140',
      '17840',
      '48520',
      '49325',
      '49327',
      '15240',
      '15320',
      '48027',
      '49425',
      '19114'
    ],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ManufacturingManagementBSEngineering,
    courseIds: ['15147', '49340', '17845'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.SoftwareTechnologyBSEngineering,
    courseIds: ['22850', '22855', '15175', '49319', '49322', '17830', '49320'],
    parentGroupings: [ParentGroupingName.Technical, ParentGroupingName.IT]
  },
  {
    name: GroupingName.AgroBusinessLandscapeManagement,
    courseIds: ['77110', '77060t', '77060', '77010', '77115'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.LaboratoryTechnician,
    courseIds: [
      '78360',
      '78310',
      '78260',
      '78065',
      '78210t',
      '78010',
      '78012',
      '78010t',
      '78012t',
      '78270',
      '78410',
      '78210',
      '78110',
      '78112',
      '78160',
      '78162'
    ],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.NutritionAndTechnology,
    courseIds: ['83210', '83010', '83110', '83160', '83060', '83065', '83110t', '83160t'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.AutomationEngineering,
    courseIds: [
      '70350',
      '70380',
      '70370',
      '70376',
      '70378',
      '70330t',
      '70310',
      '70390',
      '70330',
      '70340',
      '70320',
      '70360',
      '70395'
    ],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.AutomotiveTechnology,
    courseIds: ['70460', '70510', '70430t', '70430', '70410', '70400', '70402', '70470', '70515'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ConstructionBusinessConstructionCoordinator,
    courseIds: ['72170', '72150', '72140', '72160', '72166', '72110t', '72010', '72110'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ManagementTechnologyOffshore,
    courseIds: ['73410', '73411', '73415'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.Electrician,
    courseIds: [
      '75360',
      '75362',
      '75372',
      '75370',
      '75310',
      '75230',
      '75210t',
      '75260t',
      '75010',
      '75413',
      '75210',
      '75260',
      '75160'
    ],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.EnergyTechnology,
    courseIds: [
      '73370',
      '73372',
      '73350',
      '73344',
      '73340',
      '73330t',
      '73310',
      '73375',
      '73390',
      '73330',
      '73360',
      '73365'
    ],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.SurveyingAndMapping,
    courseIds: ['88010', '88160'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ProductionTechnology,
    courseIds: [
      '84290',
      '84415',
      '84310',
      '84410',
      '84260',
      '84160',
      '84210',
      '84110t',
      '84132',
      '84130',
      '84010',
      '84460',
      '84462',
      '84360',
      '84110',
      '84060',
      '84115',
      '84015'
    ],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ServiceEngineeringPlumbingTechnology,
    courseIds: ['75365', '75375', '75315', '75215t', '75015', '75415', '75418', '75215', '75115'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.TechnologyManagementMarineEngineering,
    courseIds: [
      '51260',
      '51265',
      '51267',
      '51270',
      '51275',
      '51190',
      '51200',
      '51210',
      '51350',
      '51360',
      '51025',
      '51020',
      '51015',
      '51045',
      '51010',
      '51030',
      '51115',
      '51110'
    ],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.MaritimeTransportNauticalScience,
    courseIds: ['79890', '79815', '79810'],
    parentGroupings: [ParentGroupingName.Technical]
  },
  {
    name: GroupingName.ArchitecturalTechnologyConstructionManagement,
    courseIds: [
      '41115',
      '41118',
      '41110t',
      '41010',
      '41020',
      '41210',
      '41211',
      '41160',
      '41170',
      '41180',
      '41215',
      '41110',
      '41112',
      '41060',
      '41062',
      '41067',
      '41069',
      '41070',
      '41117',
      '41120t',
      '41015',
      '41212',
      '41175',
      '41165',
      '41120'
    ],
    parentGroupings: [ParentGroupingName.Technical]
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
  },
  {
    name: GroupingName.English,
    courseIds: ['25450', '22220', '10308', '17215', '18015'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.French,
    courseIds: ['10324', '22245'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.IndianSouthAsianStudies,
    courseIds: ['22265', '10341'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.JapanStudies,
    courseIds: ['22280', '10340'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.ChinaStudies,
    courseIds: ['22285', '10342'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.Linguistics,
    courseIds: ['22310', '10380'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.Spanish,
    courseIds: ['25460', '10378', '22355', '17265'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.German,
    courseIds: ['25465', '17270', '10390', '22365'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },
  {
    name: GroupingName.DesignTechnologyBusiness,
    courseIds: ['73060', '73010', '73160', '73110', '73065', '73015', '73165', '73115'],
    parentGroupings: [ParentGroupingName.HumanitiesAndDesign]
  },

  /*
  IT EDUCATIONS
  */

  {
    name: GroupingName.ComputerScienceAP,
    courseIds: [
      '71710',
      '71667',
      '71660',
      '71665',
      '71610',
      '71456',
      '71460',
      '71510',
      '71112',
      '71100',
      '71110',
      '71410t',
      '71560t',
      '71060',
      '71810',
      '71812',
      '71410',
      '71413',
      '71560',
      '71562',
      '71210',
      '71212',
      '71310',
      '71715',
      '71465',
      '71515',
      '71115',
      '71415',
      '71065',
      '71815',
      '71220',
      '71375',
      '71265',
      '71217',
      '71215'
    ],
    parentGroupings: [ParentGroupingName.IT]
  },
  {
    name: GroupingName.ITTechnology,
    courseIds: [
      '76210',
      '76270',
      '76200t',
      '76010',
      '76260',
      '76200',
      '76050',
      '76215',
      '76255',
      '76065t',
      '76065',
      '76015',
      '76265'
    ],
    parentGroupings: [ParentGroupingName.IT]
  },
  {
    name: GroupingName.MultimediaDesign,
    courseIds: [
      '81510',
      '81560',
      '81580',
      '81590',
      '81460',
      '81410',
      '81420',
      '81060',
      '81310t',
      '81360',
      '81361',
      '81010',
      '81610',
      '81310',
      '81312',
      '81160',
      '81210',
      '81212',
      '81230',
      '81565',
      '81412',
      '81365',
      '81015',
      '81615',
      '81215',
      '81520',
      '81422',
      '81065',
      '81315',
      '81367',
      '81165',
      '81235'
    ],
    parentGroupings: [ParentGroupingName.IT]
  },
  {
    name: GroupingName.ITArchitecture,
    courseIds: ['60300', '60270', '60210'],
    parentGroupings: [ParentGroupingName.IT]
  },

  /*
  ECONOMIC AND BUSINESS EDUCATIONS
  */
  {
    name: GroupingName.BusinessAdministration,
    courseIds: ['25710', '22610', '22930', '13010', '20530', '17510', '18210', '20210'],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
  },
  {
    name: GroupingName.Economics,
    courseIds: ['25625', '22430', '10430', '17420'],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
  },
  {
    name: GroupingName.Taxation,
    courseIds: ['52710', '54710t', '54790', '54990', '54810', '54811', '54830', '54831', '54910'],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
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
      '45820',
      '45865'
    ],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
  },
  {
    name: GroupingName.FinancialController,
    courseIds: ['74450', '74410', '74400', '74414', '74430t', '74448', '74446', '74460', '74430'],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
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
      '74032',
      '74077',
      '74075',
      '74162'
    ],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
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
      '74610',
      '74617',
      '74615'
    ],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
  },
  {
    name: GroupingName.LogisticManagement,
    courseIds: ['87110', '87010', '87060t', '87060', '87030', '87065t', '87065', '87035'],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
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
      '79212',
      '79160',
      '79161',
      '79162',
      '79163',
      '79168',
      '79180',
      '79415',
      '79512',
      '79565',
      '79295',
      '79315',
      '79017',
      '79067',
      '79015',
      '79065',
      '79215t',
      '79267',
      '79265',
      '79615',
      '79465',
      '79215',
      '79185',
      '79165',
      '79167'
    ],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
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
      '86092',
      '86157',
      '86165',
      '86017',
      '86065',
      '86015',
      '86115t',
      '86135t',
      '86215',
      '86217',
      '86115',
      '86135',
      '86082',
      '86085',
      '86087'
    ],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
  },
  {
    name: GroupingName.AdministrativeManagement,
    courseIds: ['70212', '70210', '70200', '70010', '70010t', '70060', '70020'],
    parentGroupings: [ParentGroupingName.EconomicsAndBusiness]
  }
]
