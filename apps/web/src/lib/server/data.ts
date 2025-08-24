import _ from 'lodash'
import type {
  NewKOTCourse,
  NewKOTData,
  NewKOTGrouping,
  NewKOTInstitution,
  NewKOTInstitutionCourses
} from '@optaldk/reader'
import coursesJSON from '../../../static/data/courses.json'
import institutionsJSON from '../../../static/data/institutions.json'
import institutionCoursesJSON from '../../../static/data/institutionCourses.json'
import dataJSON from '../../../static/data/data.json'
import groupingsJSON from '../../../static/data/groupings.json'

const TABLES = {
  courses: coursesJSON as NewKOTCourse[],
  institutions: institutionsJSON as NewKOTInstitution[],
  institutionCourses: institutionCoursesJSON as NewKOTInstitutionCourses[],
  data: dataJSON as NewKOTData[],
  groupings: groupingsJSON as NewKOTGrouping[]
}

type Tables = typeof TABLES
type Row<T extends keyof Tables> = Tables[T][number]

class QueryArray<T> extends Array<T> {
  static from<U>(items: Iterable<U> | ArrayLike<U>): QueryArray<U> {
    const res = new QueryArray<U>()
    res.push(...Array.from(items))
    return res
  }
  whereEquals<K extends keyof T>(key: K, value: T[K]): QueryArray<T> {
    return QueryArray.from(this.filter((r) => r[key] === value))
  }
  whereNotEquals<K extends keyof T>(key: K, value: T[K]): QueryArray<T> {
    return QueryArray.from(this.filter((r) => r[key] !== value))
  }
  first(): T {
    return this[0]
  }
  orderBy<K extends keyof T>(key: K): QueryArray<T> {
    return QueryArray.from(this.sort((a, b) => String(a[key]).localeCompare(String(b[key]), 'en')))
  }
}

export function from<T extends keyof Tables>(table: T) {
  const rows = TABLES[table] as Row<T>[]
  return {
    select<K extends keyof Row<T>>(key: K | '*', ...keys: K[]) {
      const picked =
        key !== '*'
          ? (rows.map((row) => _.pick(row, [key, ...keys])) as Array<Pick<Row<T>, K>>)
          : rows
      return QueryArray.from(picked)
    }
  }
}
