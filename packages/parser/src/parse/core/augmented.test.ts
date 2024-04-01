import { beforeEach, describe, expect, it } from 'vitest'
import type { KOTCourse } from '../../types'
import { getAugmentedKOTInstitutions, parseCourseName } from './augmented'

describe('getAugmentedKOTInstitutions', () => {
  it('returns augmented KOT institutions', async () => {
    const data = await getAugmentedKOTInstitutions()

    expect(data[0].slug).toBeDefined()
    expect(data[9].latestName).toBeDefined()
  })
})

describe('parseCourseName', () => {
  const course: KOTCourse = {
    id: '123',
    courseNames: [],
    years: [],
    datasets: []
  }

  beforeEach(() => {
    course.courseNames = []
  })

  it('parses: "Produktionsteknolog, Kolding, Studiestart: Sommerstart"', () => {
    course.courseNames.push('Produktionsteknolog, Kolding, Studiestart: Sommerstart')

    const result = parseCourseName(course)

    expect(result).toStrictEqual({
      name: 'Produktionsteknolog',
      studyStart: 'summerstart',
      eLearning: false,
      location: 'Kolding',
      slug: 'produktionsteknolog-123'
    })
  })

  it('parses: "Professionsbachelor, maskinmester, Sønderborg, Studiestart: sommerstart"', () => {
    course.courseNames.push(
      'Professionsbachelor, maskinmester, Sønderborg, Studiestart: sommerstart'
    )

    const result = parseCourseName(course)

    expect(result).toStrictEqual({
      name: 'Professionsbachelor, maskinmester',
      studyStart: 'summerstart',
      eLearning: false,
      location: 'Sønderborg',
      slug: 'professionsbachelor-maskinmester-123'
    })
  })

  it('parses: "Markedsføringsøkonom, Esbjerg, E-læring, Studiestart: sommerstart"', () => {
    course.courseNames.push('Markedsføringsøkonom, Esbjerg, E-læring, Studiestart: sommerstart')

    const result = parseCourseName(course)

    expect(result).toStrictEqual({
      name: 'Markedsføringsøkonom',
      studyStart: 'summerstart',
      eLearning: true,
      location: 'Esbjerg',
      slug: 'markedsforingsokonom-123'
    })
  })

  it('parses: "Diplomingeniør, Bygning, Ballerup, sommer"', () => {
    course.courseNames.push('Diplomingeniør, Bygning, Ballerup, sommer')

    const result = parseCourseName(course)

    expect(result).toStrictEqual({
      name: 'Diplomingeniør, Bygning',
      studyStart: 'summerstart',
      eLearning: false,
      location: 'Ballerup',
      slug: 'diplomingenior-bygning-123'
    })
  })

  it('parses: "Bachelor of Engineering in Information and Communication Technology, Ballerup (summer)"', () => {
    course.courseNames.push(
      'Bachelor of Engineering in Information and Communication Technology, Ballerup (summer)'
    )

    const result = parseCourseName(course)

    expect(result).toStrictEqual({
      name: 'Bachelor of Engineering in Information and Communication Technology',
      studyStart: 'summerstart',
      eLearning: false,
      location: 'Ballerup',
      slug: 'bachelor-of-engineering-in-information-and-communication-technology-123'
    })
  })

  it('parses: Business, Asian Language and Culture - International Business in Asia, Chinese/English, Frederiksberg, Study start: Summer start', () => {
    course.courseNames.push(
      'Business, Asian Language and Culture - International Business in Asia, Chinese/English, Frederiksberg, Study start: Summer start'
    )

    const result = parseCourseName(course)

    expect(result).toStrictEqual({
      name: 'Business, Asian Language and Culture - International Business in Asia, Chinese/English',
      studyStart: 'summerstart',
      eLearning: false,
      location: 'Frederiksberg',
      slug: 'business-asian-language-and-culture-international-business-in-asia-chinese-english-123'
    })
  })

  it('does not parse: "Leisure Management, e-learning, Nykøbing F"', () => {
    course.courseNames.push('Leisure Management, e-learning, Nykøbing F')

    const result = parseCourseName(course)

    expect(result.location).toEqual('Nykøbing F')
    expect(result.eLearning).not.toEqual(true)
  })
})
