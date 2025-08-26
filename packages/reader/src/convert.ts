import * as XLSX from 'xlsx'
import fs from 'fs'
import { readData } from './read'
import { KOTDataPointKeys as K, KOTCourse, KOTData, KOTGrouping, KOTInstitution } from './types'

export enum DatasheetCategory {
  Accepted = 'accepted',
  Applied = 'applied',
  Quotient = 'quotient',
  GenderAccepted = 'genderAccepted',
  GenderApplied = 'genderApplied',
  AgeAccepted = 'ageAccepted',
  AgeApplied = 'ageApplied',
  EdAccepted = 'edAccepted',
  EdApplied = 'edApplied'
}

const datasheetSubcategories = {
  [DatasheetCategory.Accepted]: [K.AcceptedAdmitted, K.AcceptedStandby],
  [DatasheetCategory.Applied]: [K.AppliedTotal, K.AppliedFirstpriority],
  [DatasheetCategory.Quotient]: [K.QuotientPrimary, K.QuotientStandby],
  [DatasheetCategory.GenderAccepted]: [K.GenderAcceptedMen, K.GenderAcceptedWomen],
  [DatasheetCategory.GenderApplied]: [K.GenderAppliedMen, K.GenderAppliedWomen],
  [DatasheetCategory.AgeAccepted]: [
    K.AgeAcceptedYounger,
    K.AgeAccepted19,
    K.AgeAccepted20,
    K.AgeAccepted21,
    K.AgeAccepted22,
    K.AgeAccepted23,
    K.AgeAccepted24,
    K.AgeAccepted25,
    K.AgeAccepted26To30,
    K.AgeAcceptedOlder
  ],
  [DatasheetCategory.AgeApplied]: [
    K.AgeAppliedYounger,
    K.AgeApplied19,
    K.AgeApplied20,
    K.AgeApplied21,
    K.AgeApplied22,
    K.AgeApplied23,
    K.AgeApplied24,
    K.AgeApplied25,
    K.AgeApplied26To30,
    K.AgeAppliedOlder
  ],
  [DatasheetCategory.EdAccepted]: [
    K.EdAcceptedSTX,
    K.EdAcceptedHTX,
    K.EdAcceptedHHX,
    K.EdAcceptedHF,
    K.EdAcceptedGIF,
    K.EdAcceptedEUD,
    K.EdAcceptedEUX,
    K.EdAcceptedEUXPartOne,
    K.EdAcceptedIB,
    K.EdAcceptedIBForeign,
    K.EdAcceptedEngineer,
    K.EdAcceptedForeign,
    K.EdAcceptedFaroese,
    K.EdAcceptedGreenlandic,
    K.EdAcceptedUnknown,
    K.EdAcceptedOther
  ],
  [DatasheetCategory.EdApplied]: [
    K.EdAppliedSTX,
    K.EdAppliedHTX,
    K.EdAppliedHHX,
    K.EdAppliedHF,
    K.EdAppliedGIF,
    K.EdAppliedEUD,
    K.EdAppliedEUX,
    K.EdAppliedEUXPartOne,
    K.EdAppliedIB,
    K.EdAppliedIBForeign,
    K.EdAppliedEngineer,
    K.EdAppliedForeign,
    K.EdAppliedFaroese,
    K.EdAppliedGreenlandic,
    K.EdAppliedUnknown,
    K.EdAppliedOther
  ]
}

export function writeToXLSX(input: Awaited<ReturnType<typeof readData>>, path: string) {
  const { courses, institutions, groupings, data, institutionCourses } = input

  const augmentedCourses = courses
    .map((crs) => {
      const instutionCourse = institutionCourses
        .filter((instCrs) => instCrs.KOTCourseId === crs.KOTId)
        .sort((a, b) => a.period[1] - b.period[1])[0]

      const institution = institutions.find(
        (inst) => inst.KOTId === instutionCourse.KOTInstitutionId
      )

      const dataEntry = data.find((ent) => ent.foreignKeyId === crs.id)

      if (!institution || !dataEntry)
        throw new Error(`No institution or data entry found for course with ID ${crs.KOTId}.`)

      return {
        ...crs,
        institution,
        data: dataEntry
      }
    })
    .sort((a, b) =>
      (a.institution.latestName + a.latestName).localeCompare(
        b.institution.latestName + b.latestName
      )
    )

  const augmentedInstitutions = institutions
    .map((inst) => {
      const dataEntry = data.find((ent) => ent.foreignKeyId === inst.id)

      if (!dataEntry) throw new Error(`No data entry found for institution with ID ${inst.id}.`)

      return {
        ...inst,
        data: dataEntry
      }
    })
    .sort((a, b) => a.latestName.localeCompare(b.latestName))

  const augmentedGroupings = groupings
    .map((grp) => {
      const dataEntry = data.find((ent) => ent.foreignKeyId === grp.id)

      if (!dataEntry) throw new Error(`No data entry found for grouping with ID ${grp.id}.`)

      return {
        ...grp,
        data: dataEntry
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  writeAOAsToFile(createCourseAOAs(augmentedCourses), path, 'courses')
  writeAOAsToFile(createInstitutionAOAs(augmentedInstitutions), path, 'institutions')
  writeAOAsToFile(createGroupingAOAs(augmentedGroupings), path, 'educations')
}

function buildDatasheetAOAs<TItem>(
  items: TItem[],
  getStaticHeaderCols: () => string[],
  getRowStaticCols: (item: TItem) => string[],
  getDataPoints: (item: TItem) => Array<{ year: number } & Record<string, string | number>>,
  sheetTypeLabel: string
): Record<DatasheetCategory, string[][]> {
  const result: Record<DatasheetCategory, string[][]> = {} as Record<DatasheetCategory, string[][]>

  const years = Array.from(
    new Set(items.flatMap((it) => getDataPoints(it).map((d) => d.year)))
  ).sort((a, b) => a - b)

  const categories = Object.keys(datasheetSubcategories) as Array<
    keyof typeof datasheetSubcategories
  >

  categories.forEach((category) => {
    const keysForCategory = datasheetSubcategories[category]

    const headerStatic = getStaticHeaderCols()
    const headerRow1: string[] = [...headerStatic]
    years.forEach((year) => {
      headerRow1.push(String(year))
      for (let i = 1; i < keysForCategory.length; i++) headerRow1.push('')
    })

    const headerRow2: string[] = Array(headerStatic.length).fill('')
    years.forEach(() => {
      keysForCategory.forEach((key) => headerRow2.push(String(key)))
    })

    const titleRow: string[] = [`${sheetTypeLabel} - ${category}`]
    const rows: string[][] = [titleRow, [], headerRow1, headerRow2]

    items.forEach((item) => {
      const baseRow: string[] = [...getRowStaticCols(item)]
      const data = getDataPoints(item)

      years.forEach((year) => {
        const datapoint = data.find((d) => d.year === year)
        keysForCategory.forEach((key) => {
          const value = datapoint ? (datapoint as Record<string, string | number>)[key] : ''
          baseRow.push(value !== undefined && value !== null ? String(value) : '')
        })
      })

      rows.push(baseRow)
    })

    result[category as DatasheetCategory] = rows
  })

  return result
}

/** Creates array of arrays representing the output for courses. */
export function createCourseAOAs(
  courses: Array<
    KOTCourse & {
      institution: KOTInstitution
      data: KOTData
    }
  >
): Record<DatasheetCategory, string[][]> {
  // Structure of output files for courses.
  /*
  Courses - ${DatasheetCategory.[Name]}

  Institution id         | Institution name       | Course id | Course name | 2011              |         | 2012              |         | ...
                         |                        |           |             | Admitted directly | Standby | Admitted directly | Standby | ...
  10000                  | Københavns Universitet | 10210     | Medicin     | 500               | 18      | 480               | 12      | ...
  ...
  */

  return buildDatasheetAOAs(
    courses,
    () => ['Institution id', 'Institution name', 'Course id', 'Course name'],
    (course) => [
      course.institution.KOTId,
      course.institution.latestName,
      course.KOTId,
      course.latestName
    ],
    (course) => course.data.data as Array<{ year: number } & Record<string, string | number>>,
    'Courses'
  )
}

/** Creates array of arrays representing the output for institutions. */
export function createInstitutionAOAs(
  institutions: Array<
    KOTInstitution & {
      data: KOTData
    }
  >
): Record<DatasheetCategory, string[][]> {
  // Structure of output files for institutions.
  /*
  Institutions - ${DatasheetCategory.[Name]}

  Institution id | Institution name       | 2011              |         | 2012              |         | ...
                 |                        | Admitted directly | Standby | Admitted directly | Standby | ...
  10000          | Københavns Universitet | 500               | 18      | 480               | 12      | ...
  ...
  */

  return buildDatasheetAOAs(
    institutions,
    () => ['Institution id', 'Institution name'],
    (inst) => [inst.KOTId, inst.latestName],
    (inst) => inst.data.data as Array<{ year: number } & Record<string, string | number>>,
    'Institutions'
  )
}

/** Creates array of arrays representing the output for groupings. */
export function createGroupingAOAs(
  groupings: Array<
    KOTGrouping & {
      data: KOTData
    }
  >
): Record<DatasheetCategory, string[][]> {
  // Structure of output files for groupings.
  /*
  Educations - ${DatasheetCategory.[Name]}

  Education id | Education name   | 2011              |         | 2012              |         | ...
               |                  | Admitted directly | Standby | Admitted directly | Standby | ...
  1            | Computer science | 500               | 18      | 480               | 12      | ...
  ...
  */

  return buildDatasheetAOAs(
    groupings,
    () => ['Education id', 'Education name'],
    (grp) => [grp.id, grp.name],
    (grp) => grp.data.data as Array<{ year: number } & Record<string, string | number>>,
    'Educations'
  )
}

/** Calculates the optimal width of columns from an AOA's. */
function fitToColumns(rows: string[][]) {
  const MIN_WIDTH = 10
  const MAX_WIDTH = 30

  const numCols = Math.max(...rows.map((r) => r.length))

  return Array.from({ length: numCols }, (_, colIdx) => {
    const max = Math.max(
      ...rows.map((r) => (r[colIdx] !== undefined ? String(r[colIdx]).length : 0)),
      MIN_WIDTH
    )
    const maxLen = Math.min(max, MAX_WIDTH)
    return { wch: maxLen }
  })
}

/** Creates a XLSX workbook with inputted datasheets and writes it to a file. */
function writeAOAsToFile(
  sheets: Record<DatasheetCategory, string[][]>,
  path: string,
  filename: string
) {
  const workbook = XLSX.utils.book_new()

  Object.entries(sheets).forEach(([category, aoa]) => {
    const ws = XLSX.utils.aoa_to_sheet(aoa)

    ws['!cols'] = fitToColumns(aoa)

    XLSX.utils.book_append_sheet(workbook, ws, category)
  })

  XLSX.set_fs(fs)
  XLSX.writeFileXLSX(workbook, `${path}/${filename}.xlsx`)
}
