export function getStringFromPeriod(period: [number, number]) {
  return period.length < 2 || period[0] === period[1] ? period[0] : `${period[0]} - ${period[1]}`
}
