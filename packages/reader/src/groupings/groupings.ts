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
const DATACATEGORIES_TO_EXCLUDE = ['quotient']

export function getGroupings(institutions: KOTInstitution[]) {
  const courseMap = new Map<KOTId, KOTCourse>()
  institutions.forEach((institution) =>
    institution.courses.forEach((course) => courseMap.set(course.id, course))
  )

  const newResult = groupings.map((grouping) => getNewGrouping(grouping, courseMap))

  return newResult.sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

function getNewGrouping(
  grouping: Pick<KOTGrouping, 'name' | 'courseIds' | 'parentGroupings'>,
  courseMap: Map<KOTId, KOTCourse>
): KOTGrouping {
  if (new Set(grouping.courseIds).size !== grouping.courseIds.length) {
    throw new Error(`Grouping ${grouping.name} has duplicate courses.`)
  }

  const courses = grouping.courseIds.map((courseId) => {
    const course = courseMap.get(courseId)

    if (!course) {
      throw new Error(
        `No course found with ${courseId} when accumulating grouping ${grouping.name}.`
      )
    }

    return course
  })

  const years = _.sortBy(
    _.uniq(
      courses.flatMap(
        (course) => course.dataCategories.accepted?.datasets.map((dataset) => dataset.year) ?? 0
      )
    )
  )

  const dataCategories = _.mapValues(
    _.omit(courses[0]?.dataCategories, DATACATEGORIES_TO_EXCLUDE),
    (dataCategory) => {
      if (!dataCategory) return undefined

      return {
        ...dataCategory,
        datasets: years.map((year) => {
          const baseDataset = dataCategory.datasets[0] || {} // Use an empty object if no datasets exist
          return _.mapValues(baseDataset, (_1, key) => {
            if (key === 'year') return year

            return _.sum(
              courses.map((course) => {
                const foundDataset = course.dataCategories[dataCategory.name]?.datasets.find(
                  (ds) => ds.year === year
                )

                if (!foundDataset) return 0

                // @ts-expect-error bruh
                return foundDataset[key as KOTSubcategory]
              })
            )
          })
        })
      }
    }
  ) as KOTDataCategories

  const period = [Math.min(...years), Math.max(...years)]

  return {
    ...grouping,
    id: grouping.name,
    slug: _.kebabCase(grouping.name),
    courseCount: grouping.courseIds.length,
    dataCategories,
    period
  }
}
