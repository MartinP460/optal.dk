import { courseSearchIndexes, institutions } from '$lib/server/data'

export const load = () => {
  return {
    institutions,
    searchIndexes: courseSearchIndexes
  }
}
