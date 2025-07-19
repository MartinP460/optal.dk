import _ from 'lodash'
import { Donut } from '@unovis/ts'
import type { KOTDataCategory, KOTSubcategory, KOTSubcategoryAge } from '@optaldk/reader'
import type { DisplayType } from '$lib/utils/chartCategoryHelpers'
import { getColorFromSubcategory } from '$lib/utils/getColorFromDataset'
import { locale, t } from '$lib/i18n/index.svelte'
import { chartConfig } from '$lib/utils/chartConfig'
import { getSubCategories, isStackedBarChart } from '$lib/utils/chartCategoryHelpers'

type Datapoint = KOTDataCategory['datasets'][number]
type Datapoints = Datapoint[]

type SingleDatapoint = { subCategory: KOTSubcategoryAge; value: number }

export function getChartProps(dataCategory: KOTDataCategory, displayType?: DisplayType) {
  const data = formatNewDataset(dataCategory.datasets)

  return {
    data,
    originalData: dataCategory.datasets,
    suggestedMaxY: computeSuggestedMaxY(dataCategory, displayType ?? 'table'),
    y: getYFunctions(dataCategory.datasets),
    x: getXFunction(),
    color: getColorFunction(data),
    tickValues: getTickValueFunction(data),
    tooltip: getTooltip(dataCategory)
  }
}

export function getSingleChartProps(dataCategory: KOTDataCategory, year: number) {
  const allData = formatNewDataset(dataCategory.datasets)
  const datasetInYear = allData.find((dataset) => dataset.year === year)!
  const data = getSingleData(datasetInYear)

  return {
    data,
    triggers: getSingleTriggers(),
    centralLabel: getCentralLabel(data, year),
    value: getSingleValue(),
    color: getSingleColorFunction()
  }
}

export function getLegendLabels(dataCategory: KOTDataCategory) {
  const groups = chartConfig[dataCategory.name].subCategories.groups
  const subCategories = getSubCategories(dataCategory)

  const currentGroup = groups
    ? groups.find((group) =>
        group.subCategories.some((subCategory) => subCategories.includes(subCategory))
      )
    : null

  const groupLabel = currentGroup?.label ?? null
  const collapsedSubCategories = currentGroup?.collapsedSubCategories ?? null

  return {
    group: groupLabel,
    labels: subCategories.map((subCategory) => subCategory),
    collapsedLabels: collapsedSubCategories
  }
}

function formatNewDataset(dataset: Datapoints): Datapoints {
  const hasLetters = /[a-zA-Z]/
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

function getColorFunction(datasets: Datapoints) {
  return (_: Datapoints, i: number) => {
    const colors = Object.keys(datasets[0])
      .filter((subcategory) => subcategory !== 'year')
      .map((subcategory) => getColorFromSubcategory(subcategory as KOTSubcategory))

    return colors[i]
  }
}

function getXFunction() {
  return (d: Datapoint) => d.year
}

function getYFunctions(datasets: Datapoints) {
  const keys = Object.keys(datasets[0]).filter((key) => key !== 'year')

  // We have to do this typecast because typescript cannot infer the type of the categories
  // from Object.keys.
  return keys.map((key) => (d: Datapoint) => d[key as 'year'])
}

function computeSuggestedMaxY(dataCategory: KOTDataCategory, displayType: DisplayType) {
  if (dataCategory.name === 'quotient') {
    const QUOTIENT_MAX_Y = 13
    return QUOTIENT_MAX_Y
  }

  const isStackedBar = isStackedBarChart(dataCategory.name) && displayType === 'barchart'

  const values = Object.values(dataCategory.datasets)

  const maxValue = values.reduce((acc, item) => {
    const maxInYear = isStackedBar
      ? _.sum(Object.values(_.omit(item, ['year']) as object))
      : Math.max(...Object.values(_.omit(item, ['year']) as object))

    return maxInYear > acc ? maxInYear : acc
  }, 0)

  return maxValue * 1.2
}

function getTickValueFunction(datasets: Datapoints) {
  const labels = datasets.map((dataset) => dataset.year)
  const isEven = labels.length % 2 === 0

  const lower = labels[0]
  const upper = labels.slice(-1)[0]
  const center = labels[Math.floor(labels.length * 0.5)]
  const lowerCenter = labels[Math.floor(labels.length * (1 / 3))]
  const upperCenter = labels[Math.floor(labels.length * (2 / 3))]

  return (innerWidth: number) => {
    if (labels.length < 8) {
      return labels
    }

    if (innerWidth < 600) {
      return isEven ? [lower, lowerCenter, upperCenter, upper] : [lower, center, upper]
    } else {
      return labels
    }
  }
}

function getTooltip(dataCategory: KOTDataCategory) {
  const isGender = dataCategory.name === 'gender'

  return (d: Datapoint) => {
    let total = 0

    if (isGender) {
      const dataset = dataCategory.datasets.find((dataset) => dataset.year === d.year)
      total =
        // @ts-expect-error It does exist on one of the objects (the one we selected).
        (dataset?.genderAcceptedMen ?? dataset?.genderAppliedMen) +
        // @ts-expect-error Same as above.
        (dataset?.genderAcceptedWomen ?? dataset?.genderAppliedWomen)
    }

    return `
    <div class="flex flex-col gap-1 bg-background rounded-lg border p-2 shadow-xs">
        <span class="font-bold text-sm text-muted-foreground">
        ${d.year}
        </span>
        <div class="${Object.keys(d).length > 4 ? 'grid grid-cols-3 last:row-span-3' : ''}">
          ${Object.keys(dataCategory.datasets[0])
            .filter((key) => key !== 'year')
            .map((category) => {
              const label =
                // @ts-expect-error Typescript cannot infer the type of the categories from Object.keys.
                d[category] === ''
                  ? t('unapplicale')
                  : // @ts-expect-error Same as above.
                    (d[category] ?? '').toLocaleString(locale)

              // @ts-expect-error Same as above.
              const labelNumber = d[category]

              // @ts-expect-error Same as above.
              const categoryT = t(category)
              // @ts-expect-error Same as above.
              const color = getColorFromSubcategory(category)

              return `
              <div class="flex flex-col w-full">
                  <span class="text-[0.70rem] uppercase text-muted-foreground flex items-center">
                    ${categoryT}
                    <span class="w-2 h-2 inline-block ml-1 mr-2 rounded-[2px]" style="background-color: ${color}"></span>
                  </span>
                  <span class="font-bold text-foreground">
                    <span>${label}</span>
                    <span class="text-muted-foreground text-xs ${isGender ? 'ml-1' : ''}">
                      ${isGender ? '(' + Math.round((labelNumber / total) * 100) + '%)' : ''}
                    </span>
                    <span class="font-normal text-xs text-muted-foreground">
                      ${dataCategory.unit ? t(dataCategory.unit) : ''}
                    </span>
                  </span>
              </div>
              `
            })
            .join('')}
        </div>
    </div>
    `
  }
}

function getSingleData(datapoint: Datapoint): SingleDatapoint[] {
  return Object.entries(_.omit(datapoint, 'year')).map(([key, val]) => ({
    subCategory: key as KOTSubcategoryAge,
    value: val as number
  }))
}

function getSingleValue() {
  return (d: SingleDatapoint) => d.value
}

function getSingleTriggers() {
  return {
    [Donut.selectors.segment]: ({ data }: { data: SingleDatapoint }) => {
      const color = getColorFromSubcategory(data.subCategory)

      return `
      <div class="flex flex-col gap-1 bg-background rounded-lg border p-2 shadow-xs">
        <div class="flex flex-col w-full">
          <span class="text-[0.70rem] uppercase text-muted-foreground flex items-center">
            ${t(data.subCategory)}
            <span class="w-2 h-2 inline-block ml-1 mr-2 rounded-[2px]" style="background-color: ${color}"></span>
          </span>
          <span class="font-bold text-foreground">
            ${data.value}
            <span class="font-normal text-xs text-muted-foreground">
            </span>
          </span>
        </div>
      </div>
      `
    }
  }
}

function getSingleColorFunction() {
  return (d: SingleDatapoint) => getColorFromSubcategory(d.subCategory)
}

function getCentralLabel(data: SingleDatapoint[], year: number) {
  const zerosInSubCategories = data.every((datapoint) => datapoint.value === 0)

  return zerosInSubCategories ? t('noDataForPeriod', { period: year }) : year
}
