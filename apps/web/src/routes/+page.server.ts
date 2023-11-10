import { institutions, courseSearchIndexes } from '$lib/server/data'

export const load = () => {
  return {
    institutions,
    searchIndexes: courseSearchIndexes
  }
}
