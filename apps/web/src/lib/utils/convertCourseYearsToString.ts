import type { KOTDataCategories } from 'parser'

export function convertCourseYearsToString(dataCategory: KOTDataCategories) {
  // We pick the accepted category since it will always be defined
  const min = dataCategory?.accepted?.datasets[0].year
  const max = dataCategory?.accepted?.datasets.slice(-1)[0].year

  return min === max ? String(min) : `${min} - ${max}`
}
