export function convertCourseYearsToString(years: number[]) {
  return years.length === 1 ? String(years[0]) : `${years[0]} - ${years.slice(-1)[0]}`
}
