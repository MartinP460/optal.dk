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

  const newCourses = courses.filter(
    (course) =>
      course.period[0] === LATEST_YEAR &&
      courses.filter((newCourse) => course.id === newCourse.id.slice(0, 5)).length === 1
  )

  const transferredCourses = courses.filter(
    (course) =>
      course.period[0] === LATEST_YEAR &&
      courses.filter((newCourse) => course.id === newCourse.id.slice(0, 5)).length > 1
  )

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
  console.log(`\nTransferred courses for year ${LATEST_YEAR}:`)
  transferredCourses.forEach((course) => {
    console.log(
      `ID: ${course.id}, Name: ${course.latestName}, Institution: ${course.institutionName} (ID: ${course.institutionId})`
    )
  })
}

analyzeNewCourses()
