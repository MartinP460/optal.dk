import _ from 'lodash'
import { Donut } from '@unovis/ts'
import type { KOTData, KOTDataPointKeys } from '@optaldk/reader'
import { CategoryLabel, DisplayType, type SubCategory, SubCategoryLabel } from './categories'
import { getVisualizationState } from './visualizationState.svelte'
import { getColorFromSubcategory } from './getColorFromDataset'
import { locale, t } from '$lib/i18n/index.svelte'

const { data: initialData, category, period, displayType } = $derived(getVisualizationState())

const xyData = $derived.by(() => {
  const getDatapointKeys = (subcategories: (KOTDataPointKeys | SubCategory)[]) => {
    if (typeof subcategories[0] === 'string') return subcategories
    return getDatapointKeys(subcategories[0].subcategories)
  }

  // Adjusting the datapoints according to the category and subcategories selected.
  const filteredData = initialData.map((datapoint) =>
    _.pick(datapoint, [
      'year',
      ...(getDatapointKeys(category?.subcategories) as KOTDataPointKeys[])
    ])
  )

  // Adjusting the datapoints according to the selected period.
  // With datasets with "gaps" in years, this picks the lower and upper bound closest to those given.
  const lowerPeriod = filteredData.reduce(
    (acc, item, i) => (item.year >= period[0] && acc === -1 ? i : acc),
    -1
  )
  const upperPeriod = filteredData.reduce((acc, item, i) => (item.year <= period[1] ? i : acc), -1)
  return filteredData.slice(lowerPeriod, upperPeriod + 1)
})

const singleData = $derived(getSingleData())

export function getVisualizationChartXYProps() {
  return {
    originalData: xyData,
    data: getFormattedData(),
    x: getXFunction(),
    y: getYFunction(),
    maxY: getMaxY(),
    tooltip: getTooltip(),
    color: getColor(),
    tickValues: getTickValues()
  }
}

export function getVisualizationSingleChartProps() {
  return {
    data: singleData,
    triggers: getSingleTriggers(),
    centralLabel: getCentralLabel(),
    value: getSingleValue(),
    color: getSingleColorFunction()
  }
}

export function getLegendLabels(): {
  topLabel: SubCategoryLabel | null
  subcategories: KOTDataPointKeys[]
  collapsedSubcategories?: KOTDataPointKeys[]
} {
  // This is a bit of a mess.
  const getSubcategoryLabels = (subcategories: (SubCategory | KOTDataPointKeys)[]) => {
    if (typeof subcategories[0] === 'string') {
      return {
        subcategories: subcategories as unknown as KOTDataPointKeys[]
      }
    }
    if (typeof subcategories[0].subcategories[0] === 'string') {
      return {
        subcategories: subcategories[0].subcategories as unknown as KOTDataPointKeys[],
        collapsedSubcategories: subcategories[0].collapsedSubCategories
      }
    }
    return getSubcategoryLabels(subcategories[0].subcategories as SubCategory[])
  }

  return {
    topLabel:
      typeof category.subcategories[0] === 'object' ? category.subcategories[0].label : null,
    ...getSubcategoryLabels(category.subcategories)
  }
}

function getFormattedData() {
  // Formatting the data.
  const hasLetters = /[a-zA-Z]/
  return xyData.map((datapoint) =>
    _.mapValues(datapoint, (value: number | string) =>
      typeof value === 'string'
        ? hasLetters.test(value) || value === ''
          ? 0
          : parseFloat(value.replace(',', '.'))
        : value
    )
  ) as unknown as typeof xyData
}

function getXFunction() {
  return (d: KOTData['data'][number]) => d.year
}

function getYFunction() {
  if (!(xyData.length > 0)) return []

  return Object.keys(xyData[0])
    .filter((key) => key !== 'year')
    .map((key) => (d: KOTData['data'][number]) => d[key as 'year'])
}

function getMaxY() {
  if (category.label === CategoryLabel.Quotient) {
    const QUOTIENT_MAX_Y = 13
    return QUOTIENT_MAX_Y
  }

  const isStackedBar = category.isStackedBarChart && displayType === DisplayType.BarChart

  const values = Object.values(xyData)

  const maxValue = values.reduce((acc, item) => {
    const maxInYear = isStackedBar
      ? _.sum(Object.values(_.omit(item, ['year']) as object))
      : Math.max(...Object.values(_.omit(item, ['year']) as object))

    return maxInYear > acc ? maxInYear : acc
  }, 0)

  return maxValue * 1.2
}

function getTooltip() {
  return (d: KOTData['data'][number]) => {
    const datapoint = xyData.find((datapoint) => datapoint.year === d.year)
    if (!datapoint) return

    const showProportion =
      category?.label === CategoryLabel.Gender && Object.keys(xyData[0]).length > 2

    const total = _.sum(Object.values(_.omit(d, 'year')))

    return `
    <div class="flex flex-col gap-1 bg-background rounded-lg border p-2 shadow-xs">
        <span class="font-bold text-sm text-muted-foreground">
        ${d.year}
        </span>
        <div class="${Object.keys(d).length > 4 ? 'grid grid-cols-3 last:row-span-3' : ''}">
          ${(Object.keys(xyData[0]) as ('year' | KOTDataPointKeys)[])
            .filter((key) => key !== 'year')
            .map((category) => {
              const label =
                d[category] === ''
                  ? t('unapplicale')
                  : (d[category] ?? '').toLocaleString(locale.value)

              const labelNumber = (d[category] ?? 0) as number

              const categoryT = t(category)
              const color = getColorFromSubcategory(category)

              const proportion = (labelNumber / total) * 100
              const proportionLabel = `(${proportion < 1 ? '<1' : Math.round(proportion)}%)`

              return `
              <div class="flex flex-col w-full">
                  <span class="text-[0.70rem] uppercase text-muted-foreground flex items-center">
                    ${categoryT}
                    <span class="w-2 h-2 inline-block ml-1 mr-2 rounded-[2px]" style="background-color: ${color}"></span>
                  </span>
                  <span class="font-bold text-foreground">
                    <span>${label}</span>
                    <span class="text-muted-foreground text-xs ${showProportion ? 'ml-1' : ''}">
                      ${showProportion ? proportionLabel : ''}
                    </span>
                    ${
                      /*<span class="font-normal text-xs text-muted-foreground">
                      ${dataCategory.unit ? t(dataCategory.unit) : ''}
                    </span>*/ ''
                    }
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

function getColor() {
  return (_: KOTData['data'][number], i: number) => {
    const colors = Object.keys(xyData[0])
      .filter((subcategory) => subcategory !== 'year')
      .map((subcategory) => getColorFromSubcategory(subcategory as KOTDataPointKeys))

    return colors[i]
  }
}

function getTickValues() {
  const labels = xyData.map((datapoint) => datapoint.year)
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

function getSingleData() {
  const data = getFormattedData().find((datapoint) => datapoint.year === period[1])!

  return Object.entries(_.omit(data, 'year')).map(([key, val]) => ({
    subcategory: key as KOTDataPointKeys,
    value: val as number
  }))
}

function getSingleValue() {
  return (d: (typeof singleData)[number]) => d.value
}

function getSingleTriggers() {
  const total = Object.values(
    _.omit(
      xyData.find((datapoint) => datapoint.year === period[1]),
      'year'
    )
  ).reduce((sum: number, val) => sum + Number(val), 0)

  const showProportion = [CategoryLabel.Education, CategoryLabel.Age].includes(category.label)

  return {
    [Donut.selectors.segment]: ({ data }: { data: (typeof singleData)[number] }) => {
      const color = getColorFromSubcategory(data.subcategory)

      const proportion = (data.value / total) * 100
      const proportionLabel = `(${proportion < 1 ? '<1' : Math.round(proportion)}%)`

      return `
      <div class="flex flex-col gap-1 bg-background rounded-lg border p-2 shadow-xs">
        <div class="flex flex-col w-full">
          <span class="text-[0.70rem] uppercase text-muted-foreground flex items-center">
            ${t(data.subcategory)}
            <span class="w-2 h-2 inline-block ml-1 mr-2 rounded-[2px]" style="background-color: ${color}"></span>
          </span>
          <span class="font-bold text-foreground">
            <span>${data.value}</span>
            ${
              showProportion
                ? `<span class="text-muted-foreground text-xs ml-1">
              ${proportionLabel}
            </span>`
                : ''
            }
            ${
              /* <span class="font-normal text-xs text-muted-foreground">
              ${dataCategory.unit ? t(dataCategory.unit) : ''}
            </span> */ ''
            }
          </span>
        </div>
      </div>
      `
    }
  }
}

function getSingleColorFunction() {
  return (d: (typeof singleData)[number]) => getColorFromSubcategory(d.subcategory)
}

function getCentralLabel() {
  const zerosInSubCategories = singleData.every((datapoint) => datapoint.value === 0)

  return zerosInSubCategories ? t('noDataForPeriod', { period: period[1] }) : period[1]
}
