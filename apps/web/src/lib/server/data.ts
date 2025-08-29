import _ from 'lodash'
import type { DB } from '@optaldk/reader'
import db from '../../../static/data/json/data.json'

const tables = db as DB

type Row<T extends keyof DB> = DB[T][number]

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

export function from<T extends keyof DB>(table: T) {
  const rows = tables[table] as Row<T>[]
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
