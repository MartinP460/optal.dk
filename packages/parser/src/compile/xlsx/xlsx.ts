import * as XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'
import { KOTCategory, KOTCourse, KOTInstitution, KOTLabel } from '../../types'
import { AVAILABLE_YEARS } from '../../utils/availableYears'

const LABEL_GROUPS: { label: KOTLabel; category: KOTCategory }[] = [
  {
    label: 'accepted',
    category: 'admitted'
  },
  {
    label: 'accepted',
    category: 'standby'
  },
  {
    label: 'applied',
    category: 'total'
  },
  {
    label: 'applied',
    category: 'firstPriority'
  },
  {
    label: 'quotient',
    category: 'primary'
  },
  {
    label: 'quotient',
    category: 'standby'
  }
]

export function xlsx(data: Required<KOTInstitution>[]) {
  const rootPath = path.join(process.cwd(), '../..')
  const relativeOutputDir = process.argv.slice(2)[0]

  const defaultOutputDir = rootPath + relativeOutputDir

  // setup xlsx (Sheet.js)
  XLSX.set_fs(fs)
  XLSX.stream.set_readable(Readable)

  const workbook = XLSX.utils.book_new()

  const sheets = createSheetsFromKOTData(data)
  sheets.forEach((rows, i) => {
    const isQuotient = LABEL_GROUPS[i].label === 'quotient'

    // create worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows)

    const title = `${LABEL_GROUPS[i].label} - ${LABEL_GROUPS[i].category}`

    // append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, title)

    // calculate and set maximum institution header column width
    const max_width = rows.reduce((acc, r) => Math.max(acc, String(r[0]).length), 10)
    worksheet['!cols'] = [
      { wch: max_width * 0.9 },
      ...AVAILABLE_YEARS.map(() => ({ wch: isQuotient ? 20 : 10 }))
    ]

    // add worksheet to workbook
    XLSX.utils.sheet_add_aoa(worksheet, [[title, ...AVAILABLE_YEARS]], { origin: 'A1' })
  })

  XLSX.writeFile(workbook, `${defaultOutputDir}/data.xlsx`, { compression: true })
}

/** Creates an array of 2D arrays, one for each KOT category. */
export function createSheetsFromKOTData(data: Required<KOTInstitution>[]) {
  /* Below is the format for a single worksheet. Each worksheet is different KOT category.

    KOT label - KOT category | 2011 | 2012 | 2013 | 2014 | ...
    Institution latest name
    Course latest name | 100 | 110 | 110 | 100 | ...
    ...
    Course latest name | 100 | 110 | 110 | 100 | ...
    Institution total | 200 | 220 | 220 | 200 | ...
    
    Institution latest name
    Course latest name | 100 | 110 | 110 | 100 | ...
    ...
    Course latest name | 100 | 110 | 110 | 100 | ...
    Institution total | 200 | 220 | 220 | 200 | ...

    ...
    */

  return LABEL_GROUPS.map((labelGroup) =>
    data.flatMap((institution) => {
      const institutionHeaderRow = [institution.latestName]

      const courseRows = institution.courses.map((course) =>
        createCourseRow(course as Required<KOTCourse>, labelGroup)
      )

      const institutionSummaryRow = createInstitutionSummaryRow(institution, labelGroup)
      // the final row(s) either with a summary row and an empty row, or just an empty row
      const summaryRows = institutionSummaryRow ? [institutionSummaryRow, []] : [[]]

      return [institutionHeaderRow, ...courseRows, ...summaryRows]
    })
  )
}

/**
 * Creates the row of total figures for the institution of the category.
 * Returns `null` if admission figures does not exist for category. */
export function createInstitutionSummaryRow(
  institution: Required<KOTInstitution>,
  labelGroup: { label: KOTLabel; category: KOTCategory }
) {
  const dataset = institution.datasets.find(
    (dataset) => dataset.category === labelGroup.category && dataset.label === labelGroup.label
  )

  if (!dataset) return null

  let index = 0
  const data = AVAILABLE_YEARS.map((year) => {
    if (!institution.years.includes(year)) {
      return ''
    }

    const datapoint = dataset.data[index]
    index++
    return datapoint
  })

  return [`${institution.latestName} - total`, ...(data ?? [])]
}

/** Creates the row of figures of the category. */
export function createCourseRow(
  course: Required<KOTCourse>,
  labelGroup: { label: KOTLabel; category: KOTCategory }
) {
  const courseLatestName = course.latestName
  const dataset = course.datasets.find(
    (dataset) => dataset.category === labelGroup.category && dataset.label === labelGroup.label
  )

  if (!dataset) {
    throw new Error('Category not found in course dataset.')
  }

  let index = 0
  const data = AVAILABLE_YEARS.map((year) => {
    if (!course.years.includes(year)) {
      return ''
    }

    const datapoint = dataset.data[index]
    index++
    return datapoint
  })

  return [courseLatestName, ...data]
}
