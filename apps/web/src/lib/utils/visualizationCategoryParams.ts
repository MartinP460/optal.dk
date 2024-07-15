import { queryParam, ssp } from 'sveltekit-search-params'
import { get } from 'svelte/store'
import type {
  NewKOTCategory,
  NewKOTDataCategories
} from '$lib/utils/transformInstitutionsToNewFormat'
import { getDefaultSubCategories } from '$lib/utils/chartCategoryHelpers'

const categories = ['accepted', 'applied', 'quotient', 'gender']

export function getCategoryParams(dataCategories: NewKOTDataCategories) {
  const store = queryParam('category', ssp.string('accepted'))

  const param = get(store)

  const isValidCategory = categories.includes(param!)
  if (!isValidCategory) {
    store.set('accepted')
  }

  const initialDataCategory = getDefaultSubCategories(
    isValidCategory ? dataCategories[param as NewKOTCategory] : dataCategories.accepted
  )

  return {
    initialDataCategory,
    setCategoryParam: (category: NewKOTCategory) => store.set(category)
  }
}
