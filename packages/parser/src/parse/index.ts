import { getCoreData } from './core'
import { getGenderData } from './gender/gender'

export async function getData() {
  const coreData = await getCoreData()
  const genderData = await getGenderData(coreData)

  return genderData
}
