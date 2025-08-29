import { LATEST_YEAR, readData } from './read'

async function analyzeNewCourses() {
  const { courses, institutionCourses, institutions } = await readData()

  const newCourses = courses
    .filter((crs) => crs.period[0] === LATEST_YEAR)
    .map((crs) => ({
      ...crs,
      institution: institutions.find(
        (inst) =>
          inst.KOTId ===
          institutionCourses.find((instCrs) => instCrs.KOTCourseId === crs.KOTId)?.KOTInstitutionId
      )
    }))

  if (newCourses.length === 0) {
    console.log(`No new courses found for year ${LATEST_YEAR}.`)
    return
  }

  console.log(`New courses for year ${LATEST_YEAR}:`)
  console.log('Course ID   Institution ID   Course name\n')
  newCourses.forEach((course) => {
    console.log(
      `${course.KOTId}       ${course.institution?.KOTId}            ${course.latestName}`
    )
  })
}

analyzeNewCourses()
