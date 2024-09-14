import _ from 'lodash'
import { KOTInstitution, KOTInstitutionPartial } from '../types'

/** Changes duplicate course ID's to account for courses being moved to new institutions. */
export function removeDuplicates(institutions: KOTInstitutionPartial[]): KOTInstitution[] {
  const courses = institutions.flatMap((institution) =>
    institution.courses.map((course) => ({
      ...course,
      institution
    }))
  )

  return institutions.map((institution: KOTInstitutionPartial) => ({
    ...institution,
    courses: institution.courses.map((course) => {
      // For every course, find the courses with the same ID but in different institutions.
      const sharedCourses = courses.filter(
        (existingCourse) =>
          existingCourse.id === course.id &&
          existingCourse.institution.latestName !== institution.latestName
      )

      // If it has no shared courses, simply return an object with an empty array of otherOfferedInstitutions.
      if (sharedCourses.length === 0) {
        return { ...course, otherOfferedInstitutions: [] }
      }

      // Compute the institutions the course has been shared between.
      const otherOfferedInstitutions = sharedCourses.map((course) => course.institution.id)

      // If it has shared courses, firstly sort the courses by latest available year.
      const sortedCourses = [course, ...sharedCourses].sort((a, b) =>
        (a.period[1] ?? a.period[0]) > (b.period[1] ?? b.period[0]) ? -1 : 1
      )

      // Find the index of the current course by their periods.
      const indexOfCurrentCourse = sortedCourses.findIndex((crs) =>
        _.isEqual(crs.period, course.period)
      )

      if (indexOfCurrentCourse !== 0) {
        // Add the number of t's corresponding to how many times the course has been transfered the a different institution.
        const numberOfTsToAdd = sortedCourses.length - indexOfCurrentCourse
        const newCourseId = course.id + 't'.repeat(numberOfTsToAdd)

        return {
          ...course,
          id: newCourseId,
          otherOfferedInstitutions
        }
      }

      return {
        ...course,
        otherOfferedInstitutions
      }
    })
  }))
}
