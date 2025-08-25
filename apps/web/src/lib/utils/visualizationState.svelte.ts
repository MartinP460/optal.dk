import { queryParam, ssp } from 'sveltekit-search-params'
import { get } from 'svelte/store'
import type { KOTData } from '@optaldk/reader'
import {
  type Category,
  CategoryLabel,
  DisplayType,
  categories,
  getDefaultSubcategories
} from './categories'

type VisualizationState = {
  data: KOTData['data']
  category: Category
  displayType: DisplayType
  period: [number, number]
  categoriesToDisplay: CategoryLabel[]
}

const state: VisualizationState = $state({
  data: [],
  category: categories[CategoryLabel.Accepted],
  displayType: categories[CategoryLabel.Accepted].defaultDisplayType,
  period: [0, 0],
  categoriesToDisplay: []
})

const courseYears = $derived(state.data.map((datapoint) => datapoint.year))
const minYear = $derived(Math.min(...courseYears))
const maxYear = $derived(Math.max(...courseYears))
const has5YearsOfData = $derived(state.data.length > 4)

const categoryLabels = Object.keys(categories) as CategoryLabel[]

export function initVisualization(data: KOTData['data'], categoriesToDisplay: CategoryLabel[]) {
  const { initialCategoryLabel } = getCategoryParams()

  const initialCategory = categories[initialCategoryLabel]

  state.data = data
  state.category = {
    ...initialCategory,
    subcategories: getDefaultSubcategories(initialCategory.subcategories)
  }
  state.displayType = data.length > 4 ? initialCategory.defaultDisplayType : DisplayType.Table
  state.period = [data[0].year, data[data.length - 1].year]
  state.categoriesToDisplay = categoriesToDisplay
}

function onDisplayTypeChange(displayType: DisplayType) {
  if (displayType === DisplayType.Donutchart) {
    state.period = [maxYear, maxYear]
  } else {
    state.period = [minYear, maxYear]
  }

  state.displayType = displayType
}

function onPeriodChange(period: [number, number]) {
  const sortedPeriod = period.sort()

  state.period = sortedPeriod
}

function onCategoryChange(category: Category) {
  const { setCategoryParam } = getCategoryParams()
  const hasChangedCategory = state.category.label !== category.label

  const hasChangedToMultipleCategory =
    state.displayType === DisplayType.Donutchart &&
    !(category.defaultDisplayType === DisplayType.Donutchart) &&
    hasChangedCategory

  const hasChangedToSingleCategory =
    category.defaultDisplayType === DisplayType.Donutchart &&
    !(state.displayType === DisplayType.Donutchart) &&
    hasChangedCategory

  if (hasChangedToMultipleCategory) {
    state.period = [minYear, maxYear]
  } else if (hasChangedToSingleCategory) {
    state.period = [state.period[1], state.period[1]]
  }

  if (hasChangedCategory) {
    if (has5YearsOfData || category.defaultDisplayType === DisplayType.Donutchart) {
      state.displayType = categories[category.label].defaultDisplayType
    } else if (!has5YearsOfData) {
      state.displayType = DisplayType.Table
    }
  }

  setCategoryParam(category.label)

  state.category = hasChangedCategory
    ? { ...category, subcategories: getDefaultSubcategories(category.subcategories) }
    : category
}

function getCategoryParams() {
  const store = queryParam('category', ssp.string(CategoryLabel.Accepted), { pushHistory: false })

  const param = get(store)

  const isValidCategory = categoryLabels.includes(param as CategoryLabel)
  if (!isValidCategory) {
    store.set(CategoryLabel.Accepted)
  }

  return {
    initialCategoryLabel: param as CategoryLabel,
    setCategoryParam: (category: CategoryLabel) => store.set(category)
  }
}

export function getVisualizationState() {
  return {
    data: state.data,
    category: state.category,
    onCategoryChange,
    displayType: state.displayType,
    onDisplayTypeChange,
    period: state.period,
    onPeriodChange,
    categoriesToDisplay: state.categoriesToDisplay
  }
}
