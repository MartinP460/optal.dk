import { getAugmentedKOTInstitutions, getSearchIndex } from '$lib/server/augmented'

export const load = () => {
  return {
    institutions: getAugmentedKOTInstitutions(),
    searchIndex: getSearchIndex()
  }
}
