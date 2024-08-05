import { readCoreData } from './core/core'
import { readGenderData } from './gender/gender'
import { readAgeData } from './age/age'
import { sortInstitutionsAndCourses } from '../utils/sortInstitutionsAndCourses'

export async function getData() {
  const institutions = await readCoreData()
  const institutionsWithGender = await readGenderData(institutions)
  const institutionsWithAge = await readAgeData(institutionsWithGender)

  return sortInstitutionsAndCourses(institutionsWithAge)
}
