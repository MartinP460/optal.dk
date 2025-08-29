import { Locale } from '@optaldk/i18n'
import { describe, expect, it } from 'vitest'
import { KOTDataPointKeys as K, KOTData, type KOTDataTypes, KOTGrouping } from './types'
import {
  DatasheetCategory,
  createCourseAOAs,
  createGroupingAOAs,
  createInstitutionAOAs
} from './convert'

describe('createCourseAOAs', () => {
  const makeCourse = (
    institutionKOTId: string,
    courseKOTId: string,
    courseName: string,
    years: number[],
    valuesByYear: Record<number, Partial<KOTDataTypes>>
  ) => {
    return {
      id: 'course-fk',
      KOTId: courseKOTId,
      courseNames: [courseName],
      latestName: courseName,
      studyStart: null,
      eLearning: null,
      location: null,
      slug: courseKOTId,
      period: [years[0], years[years.length - 1]] as [number, number],
      institution: {
        id: 'inst-fk',
        KOTId: institutionKOTId,
        institutionNames: ['Inst'],
        latestName: 'Inst',
        slug: 'inst',
        period: [years[0], years[years.length - 1]] as [number, number]
      },
      data: {
        id: 'data-fk',
        foreignKeyId: 'course-fk',
        data: years.map((year) => ({ year, ...(valuesByYear[year] || {}) }))
      }
    }
  }

  it('creates correct headers and rows for accepted', () => {
    const years = [2011, 2012, 2013]
    const course = makeCourse('10000', '10210', 'Medicin', years, {
      [years[0]]: { [K.AcceptedAdmitted]: 500, [K.AcceptedStandby]: 18 },
      [years[1]]: { [K.AcceptedAdmitted]: 480, [K.AcceptedStandby]: 12 },
      [years[2]]: { [K.AcceptedAdmitted]: 470, [K.AcceptedStandby]: 10 }
    })

    const aoas = createCourseAOAs([course], 'en' as Locale)
    const accepted = aoas.accepted

    const expected = [
      ['Courses - Accepted'],
      [],
      [
        'Institution ID',
        'Institution name',
        'Course ID',
        'Course name',
        '2011',
        '',
        '2012',
        '',
        '2013',
        ''
      ],
      [
        '',
        '',
        '',
        '',
        'Directly admitted',
        'Standby',
        'Directly admitted',
        'Standby',
        'Directly admitted',
        'Standby'
      ],
      ['10000', 'Inst', '10210', 'Medicin', '500', '18', '480', '12', '470', '10']
    ]

    expect(accepted).toEqual(expected)
  })

  it('includes all categories with header rows', () => {
    const years = [2011]
    const course = makeCourse('10000', '10210', 'Medicin', years, {
      [years[0]]: {
        [K.AcceptedAdmitted]: 1,
        [K.AcceptedStandby]: 2,
        [K.AppliedTotal]: 3,
        [K.AppliedFirstpriority]: 4,
        [K.QuotientPrimary]: '7.0',
        [K.QuotientStandby]: '6.5',
        [K.GenderAcceptedMen]: 5,
        [K.GenderAcceptedWomen]: 6,
        [K.GenderAppliedMen]: 7,
        [K.GenderAppliedWomen]: 8,
        [K.AgeAcceptedYounger]: 9,
        [K.AgeAppliedYounger]: 10,
        [K.EdAcceptedSTX]: 11,
        [K.EdAppliedSTX]: 12
      }
    })

    const aoas = createCourseAOAs([course], 'en' as Locale)

    Object.values(DatasheetCategory).forEach((cat) => {
      expect(aoas[cat]).toBeDefined()
      expect(Array.isArray(aoas[cat])).toBe(true)
      expect(aoas[cat].length).toBeGreaterThanOrEqual(4) // title, spacer, 2 header rows
      expect(aoas[cat][2].slice(0, 4)).toEqual([
        'Institution ID',
        'Institution name',
        'Course ID',
        'Course name'
      ])
    })
  })
})

describe('createInstitutionAOAs', () => {
  const makeInstitution = (
    institutionKOTId: string,
    institutionName: string,
    years: number[],
    valuesByYear: Record<number, Partial<KOTDataTypes>>
  ) => {
    return {
      id: 'inst-fk',
      KOTId: institutionKOTId,
      institutionNames: [institutionName],
      latestName: institutionName,
      slug: 'inst',
      period: [years[0], years[years.length - 1]] as [number, number],
      data: {
        id: 'inst-data-fk',
        foreignKeyId: 'inst-fk',
        data: years.map((year) => ({ year, ...(valuesByYear[year] || {}) }))
      }
    }
  }

  it('creates correct headers and rows for accepted', () => {
    const years = [2011, 2012, 2013]
    const institution = makeInstitution('10000', 'Københavns Universitet', years, {
      [years[0]]: { [K.AcceptedAdmitted]: 500, [K.AcceptedStandby]: 18 },
      [years[1]]: { [K.AcceptedAdmitted]: 480, [K.AcceptedStandby]: 12 },
      [years[2]]: { [K.AcceptedAdmitted]: 470, [K.AcceptedStandby]: 10 }
    })

    const aoas = createInstitutionAOAs([institution], 'en' as Locale)
    const accepted = aoas.accepted

    const expected = [
      ['Institutions - Accepted'],
      [],
      ['Institution ID', 'Institution name', '2011', '', '2012', '', '2013', ''],
      [
        '',
        '',
        'Directly admitted',
        'Standby',
        'Directly admitted',
        'Standby',
        'Directly admitted',
        'Standby'
      ],
      ['10000', 'Københavns Universitet', '500', '18', '480', '12', '470', '10']
    ]

    expect(accepted).toEqual(expected)
  })
})

describe('createGroupingAOAs', () => {
  const makeGrouping = (
    id: string,
    name: string,
    years: number[],
    valuesByYear: Record<number, Partial<KOTDataTypes>>
  ) => {
    return {
      id,
      name,
      slug: 'grouping',
      courseIds: [],
      parentGroupings: [],
      period: [years[0], years[years.length - 1]] as [number, number],
      data: {
        id: 'grp-data-fk',
        foreignKeyId: id,
        data: years.map((year) => ({ year, ...(valuesByYear[year] || {}) }))
      }
    } as KOTGrouping & { data: KOTData }
  }

  it('creates correct headers and rows for accepted', () => {
    const years = [2011, 2012, 2013]
    const grouping = makeGrouping('grp-1', 'Computer science', years, {
      [years[0]]: { [K.AcceptedAdmitted]: 500, [K.AcceptedStandby]: 18 },
      [years[1]]: { [K.AcceptedAdmitted]: 480, [K.AcceptedStandby]: 12 },
      [years[2]]: { [K.AcceptedAdmitted]: 470, [K.AcceptedStandby]: 10 }
    })

    const aoas = createGroupingAOAs([grouping], 'en' as Locale)
    const accepted = aoas.accepted

    const expected = [
      ['Educations - Accepted'],
      [],
      ['Education ID', 'Education name', '2011', '', '2012', '', '2013', ''],
      [
        '',
        '',
        'Directly admitted',
        'Standby',
        'Directly admitted',
        'Standby',
        'Directly admitted',
        'Standby'
      ],
      ['grp-1', 'Computer science', '500', '18', '480', '12', '470', '10']
    ]

    expect(accepted).toEqual(expected)
  })
})
