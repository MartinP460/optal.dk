import { describe, expect, it } from 'vitest'
import { LATEST_YEAR, readData } from './read'
import { KOTDataPointKeys } from './newTypes'

describe('readData', async () => {
  const { institutions, courses, institutionCourses, data } = await readData()

  describe('institutions', () => {
    it("generates institutions with unique KOT ID's", () => {
      const uniqueIds = new Set(institutions.map((inst) => inst.KOTId))
      expect(institutions.length).toBe(uniqueIds.size)
    })

    it('generates institutions with all required properties', () => {
      const ku = institutions.find(
        (institution) => institution.latestName === 'Københavns Universitet'
      )

      expect(ku).toBeDefined()
      expect(ku?.latestName).toBeDefined()
      expect(ku?.id).toBeDefined()
      expect(ku?.KOTId).toBeDefined()
      expect(ku?.institutionNames).toBeDefined()
      expect(ku?.institutionNames.includes('Københavns Universitet')).toBeTruthy()
      expect(ku?.period).toStrictEqual([2011, LATEST_YEAR])
    })
  })

  describe('courses', () => {
    it("generates courses with unique KOT ID's", () => {
      const uniqueIds = new Set(institutions.map((inst) => inst.KOTId))
      expect(institutions.length).toBe(uniqueIds.size)
    })

    it('generates courses with all required properties', () => {
      const cs = courses.find((crs) => crs.latestName === 'Datalogi')

      expect(cs?.latestName).toBeDefined()
      expect(cs?.id).toBeDefined()
      expect(cs?.courseNames).toBeDefined()
      expect(cs?.courseNames.includes('Datalogi')).toBeTruthy()
      expect(cs?.period).toStrictEqual([2011, LATEST_YEAR])
    })
  })

  // Note that we're using "live" data in these unit tests so it may fail if the data is updated.
  describe('institutionCourses', () => {
    it('accounts for courses that have not been transfered', () => {
      const KOTCourseId = '10220'
      const course = courses.find((crs) => crs.KOTId === KOTCourseId)

      expect(course?.latestName).toBe('Datalogi')
      expect(
        institutionCourses.filter((instCrs) => instCrs.KOTCourseId === KOTCourseId)
      ).toHaveLength(1)
    })

    it('accounts for courses that have been transfered', () => {
      const KOTCourseId = '71110'
      const course = courses.find((crs) => crs.KOTId === KOTCourseId)

      const institutions = institutionCourses.filter(
        (instCrs) => instCrs.KOTCourseId === KOTCourseId
      )

      expect(course?.latestName).toBe('Datamatiker')
      // This course has been transfered twice.
      expect(institutions).toHaveLength(2)
    })
  })

  describe('data', () => {
    it("generates data with unique KOT ID's", () => {
      const uniqueIds = new Set(data.map((ent) => ent.KOTId))
      expect(data.length).toBe(uniqueIds.size)
    })

    it('generates data with all KOT datapoint keys', () => {
      const KOTCourseId = '10220'
      const courseData = data.find((ent) => ent.KOTId === KOTCourseId)

      expect(
        Object.values(courseData?.data.find((datapoints) => datapoints.year === 2020) ?? {})
      ).toHaveLength(Object.values(KOTDataPointKeys).length + 1)
    })
  })
})
