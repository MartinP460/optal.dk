import { error } from '@sveltejs/kit'
import _ from 'lodash'
import type { KOTCourse } from 'parser'
import { institutions } from '$lib/server/data'

export async function load({ params }) {
  const institution = institutions.find((institution) => institution.slug === params.institution)

  if (!institution) {
    error(404, 'Institution not found.')
  }

  const course = institution.courses.find((course) => course.slug === params.course) as
    | Required<KOTCourse>
    | undefined

  if (!course) {
    error(404, 'Course not found.')
  }

  const courseData = {
    labels: course.years,
    datasets: course.datasets
  }

  const courseLabelGroups = _.toArray(_.groupBy(course.datasets, 'category'))

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
  return institutions.flatMap((institution) =>
    institution.courses.map((course) => ({
      course: course.slug as string,
      institution: institution.slug
    }))
  )
}
