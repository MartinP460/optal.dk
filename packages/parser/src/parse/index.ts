import { readCoreData } from './core/core'
import { readGenderData } from './gender/gender'
import { sortInstitutionsAndCourses } from '../utils/sortInstitutionsAndCourses'

export async function getData() {
  const institutions = await readCoreData()
  const institutionsWithGender = await readGenderData(institutions)

  return sortInstitutionsAndCourses(institutionsWithGender)
}
