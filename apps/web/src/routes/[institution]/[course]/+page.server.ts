import { getAugmentedKOTInstitutions } from '$lib/server/augmented'
import type { KOTCourse } from '$lib/types/KOT.js'
import { error } from '@sveltejs/kit'
import _ from 'lodash'

export async function load({ params }) {
  const data = await getAugmentedKOTInstitutions()

  const institution = data.find((institution) => institution.slug === params.institution)

  if (!institution) {
    throw error(404, 'Institution not found.')
  }

  const course = institution.courses.find((course) => course.slug === params.course) as
    | Required<KOTCourse>
    | undefined

  if (!course) {
    throw error(404, 'Course not found.')
  }

  const courseData = {
    labels: course.years,
    datasets: course.datasets
  }

  const courseLabelGroups = _.toArray(_.groupBy(course.datasets, 'label'))

  return {
    institution: {
      slug: institution.slug,
      latestName: institution.latestName
    },
    course,
    courseData,
    courseLabelGroups
  }
}

export async function entries() {
  const data = await getAugmentedKOTInstitutions()

  return data.flatMap((institution) =>
    institution.courses.map((course) => ({
      course: course.slug as string,
      institution: institution.slug
    }))
  )
}
