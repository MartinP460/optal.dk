import { readCoreData } from './core/core'
import { readGenderData } from './gender/gender'
import { readAgeData } from './age/age'
import { readEducationData } from './education/education'
import { sortInstitutionsAndCourses } from '../utils/sortInstitutionsAndCourses'
import { removeDuplicates } from '../utils/removeDuplicates'

export async function getInstitutions() {
  const institutions = await readCoreData()
  const institutionsWithGender = await readGenderData(institutions)
  const institutionsWithAge = await readAgeData(institutionsWithGender)
  const institutionsWithEducation = await readEducationData(institutionsWithAge)

  return sortInstitutionsAndCourses(removeDuplicates(institutionsWithEducation))
}
