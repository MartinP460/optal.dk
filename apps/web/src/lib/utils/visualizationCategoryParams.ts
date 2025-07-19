import { queryParam, ssp } from 'sveltekit-search-params'
import { get } from 'svelte/store'
import type { KOTCategory, KOTDataCategories, KOTDataCategory } from '@optaldk/reader'
import { getDefaultSubCategories } from '$lib/utils/chartCategoryHelpers'

const categories = ['accepted', 'applied', 'quotient', 'gender', 'age', 'education']

export function getCategoryParams(dataCategories: KOTDataCategories) {
  const store = queryParam('category', ssp.string('accepted'), { pushHistory: false })

  const param = get(store)

  const isValidCategory = categories.includes(param!)
  if (!isValidCategory) {
    store.set('accepted')
  }

  const initialDataCategory = getDefaultSubCategories(
    (isValidCategory
      ? dataCategories[param as KOTCategory]
      : (dataCategories.accepted as KOTDataCategory)) as KOTDataCategory
  )

  return {
    initialDataCategory,
    setCategoryParam: (category: KOTCategory) => store.set(category)
  }
}
