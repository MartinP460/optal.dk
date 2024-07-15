import { get } from 'svelte/store'
import _ from 'lodash'
import type {
  NewKOTDataCategory,
  NewKOTSubcategory
} from '$lib/utils/transformInstitutionsToNewFormat'
import { getNewGetColorFromDataset } from '$lib/utils/getColorFromDataset'
import { t as i18n, locale } from '$lib/i18n'
import { chartConfig } from '$lib/utils/chartConfig'
import { getSubCategories } from '$lib/utils/chartCategoryHelpers'

export function getChartProps(dataCategory: NewKOTDataCategory) {
  const data = formatNewDataset(dataCategory.datasets)

  return {
    data,
    originalData: dataCategory.datasets,
    suggestedMaxY: computeSuggestedMaxY(data),
    legendLabels: getLegendLabels(dataCategory),
    y: getYFunctions(dataCategory.datasets),
    x: getXFunction(),
    color: getColorFunction(data),
    tooltip: getTooltip(dataCategory)
  }
}

function getLegendLabels(dataCategory: NewKOTDataCategory) {
  const groups = chartConfig[dataCategory.name].subCategories.groups
  const subCategories = getSubCategories(dataCategory)

  const groupLabel = groups
    ? groups.find((group) =>
        group.subCategories.some((subCategory) => subCategories.includes(subCategory))
      )?.label
    : null

  return subCategories.map((subCategory) => ({
    group: groupLabel ?? null,
    label: subCategory
  }))
}

function formatNewDataset(dataset: NewKOTDataCategory['datasets']): NewKOTDataCategory['datasets'] {
  const hasLetters = /[a-zA-Z]/
  // @ts-expect-error The data category can be any of the ones in the return type.
  return dataset.map((data) =>
    _.mapValues(data, (value: number | string) =>
      typeof value === 'string'
        ? hasLetters.test(value) || value === ''
          ? 0
          : parseFloat(value.replace(',', '.'))
        : value
    )
  )
}

function getColorFunction(datasets: NewKOTDataCategory['datasets']) {
  return (_: NewKOTDataCategory['datasets'], i: number) => {
    const colors = Object.keys(datasets[0])
      .filter((subcategory) => subcategory !== 'year')
      .map((subcategory) => getNewGetColorFromDataset(subcategory as NewKOTSubcategory))

    return colors[i]
  }
}

function getXFunction() {
  return (d: NewKOTDataCategory['datasets'][number]) => d.year
}

function getYFunctions(datasets: NewKOTDataCategory['datasets']) {
  const keys = Object.keys(datasets[0]).filter((key) => key !== 'year')

  // We have to do this typecast because typescript cannot infer the type of the categories
  // from Object.keys.
  return keys.map((key) => (d: NewKOTDataCategory['datasets'][number]) => d[key as 'year'])
}

function computeSuggestedMaxY(datasets: NewKOTDataCategory['datasets']) {
  const QUOTIENT_MAX_Y = 13

  // @ts-expect-error These properties do exist on one of the data categories.
  const isQuotient = datasets[0]?.quotientPrimary || datasets[0]?.quotientStandby
  if (isQuotient) {
    return QUOTIENT_MAX_Y
  }

  const values = Object.values(datasets)

  const maxValue = values.reduce((acc, item) => {
    const maxInYear = Math.max(...Object.values(_.omit(item, ['year']) as object))

    return maxInYear > acc ? maxInYear : acc
  }, 0)

  return maxValue * 1.2
}

function getTooltip(dataCategory: NewKOTDataCategory) {
  const t = get(i18n)
  const currentLocale = get(locale)

  return (d: NewKOTDataCategory['datasets'][number]) => {
    return `
    <div class="flex flex-col gap-1 bg-background rounded-lg border p-2 shadow-sm">
        <span class="font-bold text-sm text-muted-foreground">
        ${d.year}
        </span>
        ${Object.keys(dataCategory.datasets[0])
          .filter((key) => key !== 'year')
          .map((category) => {
            const label =
              // @ts-expect-error Typescript cannot infer the type of the categories from Object.keys.
              d[category] === ''
                ? t('unapplicale')
                : // @ts-expect-error Same as above.
                  (d[category] ?? '').toLocaleString(currentLocale)

            // @ts-expect-error Same as above.
            const categoryT = t(category)

            return `
            <div class="flex flex-col">
                <span class="text-[0.70rem] uppercase text-muted-foreground">
                  ${categoryT}
                </span>
                <span class="font-bold text-foreground">
                  ${label}
                  <span class="font-normal text-xs text-muted-foreground">
                    ${dataCategory.unit ? t(dataCategory.unit) : ''}
                  </span>
                </span>
            </div>
            `
          })
          .join('')}
    </div>
    `
  }
}
