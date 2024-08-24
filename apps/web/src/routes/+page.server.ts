import _ from 'lodash'
import { ParentGroupingName } from 'parser'
import { courseSearchIndexes, groupings, institutions } from '$lib/server/data'

export const load = () => {
  // we are removing properties to reduce the amount of data sent over the network
  const shortenedInstitutions = institutions.map(({ id, latestName, slug, courses }) => ({
    id,
    latestName,
    slug,
    courses: courses.map(({ id, latestName, slug, location, studyStart, eLearning, period }) => ({
      id,
      latestName,
      slug,
      location,
      studyStart,
      eLearning,
      period
    }))
  }))

  const shortenedGroupings = _.mapValues(
    _.keyBy(Object.values(ParentGroupingName)),
    (parentGroupingName) =>
      groupings
        .filter((grouping) => grouping.parentGroupings.includes(parentGroupingName))
        .map(({ id, name, slug, period, courseCount }) => ({
          id,
          name,
          slug,
          period,
          courseCount
        }))
  )

  const parentGroupings = Object.entries(shortenedGroupings) as [
    ParentGroupingName,
    (typeof shortenedGroupings)[keyof typeof shortenedGroupings]
  ][]

  return {
    institutions: shortenedInstitutions,
    parentGroupings,
    searchIndexes: courseSearchIndexes
  }
}
