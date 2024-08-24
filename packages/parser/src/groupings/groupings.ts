import _ from 'lodash'
import { groupings } from '../constants'
import {
  KOTCourse,
  KOTDataCategories,
  KOTGrouping,
  KOTId,
  KOTInstitution,
  KOTSubcategory
} from '../types'

// It doesn't make any sense to sum quotient so we exclude it.
export const DATACATEGORIES_TO_EXCLUDE = ['quotient']

export function getGroupings(institutions: KOTInstitution[]) {
  const courseMap = new Map<KOTId, KOTCourse>()
  institutions.forEach((institution) =>
    institution.courses.forEach((course) => courseMap.set(course.id, course))
  )

  const newResult = groupings.map((grouping) => getNewGrouping(grouping, courseMap))

  return newResult
}

function getNewGrouping(
  grouping: Pick<KOTGrouping, 'name' | 'courseIds' | 'parentGroupings'>,
  courseMap: Map<KOTId, KOTCourse>
): KOTGrouping {
  const courses = grouping.courseIds.map((courseId) => {
    const course = courseMap.get(courseId)

    if (!course) {
      throw new Error(
        `No course found with ${courseId} when accumulating grouping ${grouping.name}.`
      )
    }

    return course
  })

  const dataCategories = _.mapValues(
    _.omit(courses[0]?.dataCategories, DATACATEGORIES_TO_EXCLUDE),
    (dataCategory) => ({
      ...dataCategory,
      datasets: dataCategory?.datasets.map((dataset) =>
        _.mapValues(dataset, (value, key) => {
          if (key === 'year') return value

          return _.sum(
            courses.map(
              (course) =>
                // @ts-expect-error bruh
                // eslint-disable-next-line no-unsafe-optional-chaining
                (course.dataCategories[dataCategory.name]?.datasets.find(
                  (dataCategory) => dataCategory.year === dataset.year
                ))[key as KOTSubcategory]
            )
          )
        })
      )
    })
  ) as KOTDataCategories

  const years = courses.flatMap((course) => course.period)
  const period = [Math.min(...years), Math.max(...years)]

  return {
    ...grouping,
    id: grouping.name,
    slug: grouping.name,
    courseCount: grouping.courseIds.length,
    dataCategories,
    period
  }
}
