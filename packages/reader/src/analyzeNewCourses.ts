import { getInstitutions } from './institutions'
import { LATEST_YEAR } from './constants'

async function analyzeNewCourses() {
  const institutions = await getInstitutions()
  const courses = institutions.flatMap((institution) =>
    institution.courses.map((course) => ({
      ...course,
      institutionName: institution.latestName,
      institutionId: institution.id
    }))
  )

  // New courses are those where period[0] === LATEST_YEAR.
  const newCourses = courses.filter((course) => course.period[0] === LATEST_YEAR)

  if (newCourses.length === 0) {
    console.log(`No new courses found for year ${LATEST_YEAR}.`)
    return
  }

  console.log(`New courses for year ${LATEST_YEAR}:`)
  newCourses.forEach((course) => {
    console.log(
      `ID: ${course.id}, Name: ${course.latestName}, Institution: ${course.institutionName} (ID: ${course.institutionId})`
    )
  })
}

analyzeNewCourses()
