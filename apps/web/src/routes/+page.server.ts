import Fuse from 'fuse.js'
import { type NewKOTGrouping, ParentGroupingName } from '@optaldk/reader'
import { t } from '$lib/i18n/index.svelte'
import { from } from '$lib/server/data'

export const load = () => {
  const institutions = from('institutions')
    .select('id', 'KOTId', 'latestName', 'slug')
    .map((inst) => ({
      ...inst,
      courses: from('institutionCourses')
        .select('id', 'KOTInstitutionId', 'KOTCourseId', 'period')
        .filter((instCrs) => instCrs.KOTInstitutionId === inst.KOTId)
        .map(({ KOTCourseId, period }) => ({
          ...from('courses')
            .select('id', 'KOTId', 'latestName', 'slug', 'location', 'studyStart', 'eLearning')
            .whereEquals('KOTId', KOTCourseId)
            .first(),
          period
        }))
        .sort((a, b) => a.latestName.localeCompare(b.latestName, 'en'))
    }))

  const courses = from('courses')
    .select('id', 'KOTId', 'latestName', 'slug', 'location', 'studyStart', 'eLearning', 'period')
    .map((crs) => ({
      ...crs,
      institution: from('institutionCourses')
        .select('KOTCourseId', 'KOTInstitutionId', 'period')
        .whereEquals('KOTCourseId', crs.KOTId)
        .sort((a, b) => a.period[1] - b.period[1])
        .map((instCrs) =>
          from('institutions')
            .select('id', 'slug', 'latestName', 'KOTId')
            .whereEquals('KOTId', instCrs.KOTInstitutionId)
            .first()
        )[0]
    }))

  const institutionIndex = Fuse.createIndex(['latestName'], institutions).toJSON()
  const courseIndex = Fuse.createIndex(['latestName', 'location'], courses).toJSON()

  const parentGroupings: [ParentGroupingName, NewKOTGrouping[]][] = Object.values(
    ParentGroupingName
  ).map((parentGroupingName) => [
    parentGroupingName,
    from('groupings')
      .select('*')
      .filter((grp) => grp.parentGroupings.includes(parentGroupingName))
      .sort((a, b) => t(a.name).localeCompare(t(b.name), 'en'))
  ])

  return {
    institutions,
    courses,
    searchIndexes: { institutionIndex, courseIndex },
    parentGroupings
  }
}
