import slugify from 'slugify'
import type { KOTCourse, KOTDataset, KOTInstitution } from '../../types'
import { getCoreKOTData } from './core'
import { cities } from '../../utils/cities'

/** Creates a "slug" from the name of an institution or course. */
function createSlug(name: string) {
  // replaces the characters / and , with -
  const additionallyTransformedName = `${name.replaceAll(/[/,]/g, '-')}`

  return slugify(additionallyTransformedName, {
    replacement: '-',
    remove: /[*+~./()'"!:@]/g,
    lower: true
  })
}

/** Transforms an item in the array of meta-data into a standarized format. */
function transformMetaData(metaData: string[]): {
  studyStart: 'winterstart' | 'summerstart' | null
  eLearning: boolean | null
  location: string | null
} {
  let studyStart = null
  let eLearning = false
  let location = null

  metaData.forEach((metaItem) => {
    const item = metaItem.toLowerCase()

    if (item.includes('sommer') || item.includes('summer')) {
      studyStart = 'summerstart'
      return
    }
    if (item.includes('vinter') || item.includes('winter')) {
      studyStart = 'winterstart'
      return
    }
    if (item.includes('e-læring') || item.includes('e-learning')) {
      eLearning = true
      return
    }
    if (cities.includes(item)) {
      location = metaItem
      return
    }

    throw new Error(`Metadata item not recognized: "${metaItem}"`)
  })

  return { studyStart, eLearning, location }
}

/** Replaces any course meta data wrapped in parenthes with commas, e.g. "...Ballerup (winter)" with "...Ballerup, winter" */
function replaceCourseMetaInParentheses(str: string) {
  return str
    .replace(' (sommer)', ', sommer')
    .replace(' (vinter)', ', vinter')
    .replace(' (summer)', ', summer')
    .replace(' (winter)', ', winter')
}

/** Parses course names to extract or create the core name, meta-information and slug from the name. */
export function parseCourseName(course: KOTCourse) {
  const latestName = replaceCourseMetaInParentheses(course.courseNames.slice(-1)[0])
  const parts = latestName.split(', ')

  const indexOfLocation = parts.findIndex((part) => cities.includes(part.toLowerCase()))

  if (indexOfLocation === -1) {
    return {
      name: latestName,
      studyStart: null,
      eLearning: null,
      location: null,
      slug: course.id
    }
  }

  const name = parts.slice(0, indexOfLocation).join(', ')
  const meta = transformMetaData(parts.slice(indexOfLocation))
  const slug = createSlug(`${name}-${course.id}`)

  return {
    name,
    slug,
    ...meta
  }
}

/** Adds a ´max´ property (which is the max-y value to render in a chart) and a unit. */
function augmentDataset(courseOrInstitution: KOTInstitution | KOTCourse): KOTDataset[] {
  return courseOrInstitution.datasets.map((dataset) => {
    if (dataset.category === 'accepted' || dataset.category === 'applied') {
      const admittedDataset = courseOrInstitution.datasets.find((dataset) => dataset.id === 3)

      if (!admittedDataset) return { ...dataset, max: undefined }

      const hasLetters = /[a-zA-Z]/g
      const courseData = admittedDataset.data.map((datapoint) =>
        typeof datapoint === 'string'
          ? hasLetters.test(datapoint) || datapoint === ''
            ? 0
            : parseFloat(datapoint.replace(',', '.'))
          : datapoint
      )

      const maxValue = Math.max(...courseData)

      let roundedMax

      if (maxValue < 50) {
        roundedMax = 50
      } else if (maxValue + 100 < 1000) {
        roundedMax = Math.ceil(maxValue / 100) * 100
      } else if (maxValue + 200 < 5000) {
        roundedMax = Math.ceil(maxValue / 200) * 200
      } else if (maxValue + 1000 < 20000) {
        roundedMax = Math.ceil(maxValue / 1000) * 1000
      } else {
        roundedMax = Math.ceil((maxValue + 1000) / 5000) * 5000
      }

      return {
        ...dataset,
        max: roundedMax,
        unit: 'persons'
      }
    }

    return {
      ...dataset,
      max: 14,
      unit: null
    }
  })
}

/** Augments all courses with fields latestName, meta, slug, and `max` in type `KOTDataset`. */
function augmentCourses(courses: KOTCourse[]): Required<KOTCourse>[] {
  return courses.map((course) => {
    const { name, ...rest } = parseCourseName(course)

    const datasetsWithMax = augmentDataset(course)

    return {
      ...course,
      ...rest,
      latestName: name,
      datasets: datasetsWithMax
    }
  })
}

/** Fetches KOT institutions augmented with all optional fields in types `KOTData`, `KOTCourse` and `KOTDataset`. */
export async function getAugmentedKOTInstitutions(): Promise<Required<KOTInstitution>[]> {
  const data = await getCoreKOTData()

  return data
    .map((institution) => ({
      ...institution,
      courses: augmentCourses(institution.courses).sort((a, b) =>
        a.latestName.localeCompare(b.latestName, 'en')
      ),
      latestName: institution.institutionNames.slice(-1)[0],
      slug: createSlug(institution.institutionNames.slice(-1)[0]),
      datasets: augmentDataset(institution)
    }))
    .sort((a, b) => a.latestName.localeCompare(b.latestName, 'en'))
}
