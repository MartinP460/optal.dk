import { get } from 'svelte/store'
import type { KOTDataset, KOTSubCategory, KOTSubSubCategory } from 'parser'
import { getColorFromDataset } from '$lib/utils/getColorFromDataset'
import { t as i18n, locale } from '$lib/i18n'

type ChartData = { year: number } & {
  [key in KOTSubCategory | KOTSubSubCategory]?: number
}

type ChartDataRaw = { year: number } & {
  [key in KOTSubCategory | KOTSubSubCategory]?: number | string
}

type KOTDatasetForChart = Omit<KOTDataset, 'data'> & {
  data: number[]
  originalData: KOTDataset['data']
}

function formatDatapoints(data: KOTDataset['data']) {
  const hasLetters = /[a-zA-Z]/
  return data.map((datapoint) =>
    typeof datapoint === 'string'
      ? hasLetters.test(datapoint) || datapoint === ''
        ? 0
        : parseFloat(datapoint.replace(',', '.'))
      : datapoint
  )
}

export function addDatasetsProperties(datasets: KOTDataset[]): KOTDatasetForChart[] {
  return datasets
    .map((dataset) => ({
      ...dataset,
      originalData: dataset.data,
      data: formatDatapoints(dataset.data)
    }))
    .sort((a, b) => a.id - b.id)
}

export function formatData(datasets: KOTDataset[]): ChartData[] {
  return datasets[0].data.map((_, i) => ({
    year: datasets[0].years[i],
    ...datasets.reduce(
      (acc, elm) => ({
        ...acc,
        [elm.categories.subsubcategory ?? elm.categories.subcategory]: elm.data[i]
      }),
      {}
    )
  }))
}

export function getColorFunction(datasets: KOTDataset[]) {
  return (_: ChartData, i: number) => datasets.map((dataset) => getColorFromDataset(dataset))[i]
}

export function getXFunction() {
  return (d: ChartData) => d.year
}

export function getYFunctions(datasets: KOTDataset[]) {
  return datasets.map(
    (dataset) => (d: ChartData) =>
      d[dataset.categories.subsubcategory ?? dataset.categories.subcategory]
  )
}

export function computeSuggestedMaxY(datasets: KOTDatasetForChart[]) {
  const QUOTIENT_MAX_Y = 13

  if (datasets[0].categories.category === 'quotient') {
    return QUOTIENT_MAX_Y
  }

  return Math.max(...datasets.map((dataset) => Math.max(...dataset.data))) * 1.2
}

export function getTooltip(datasets: KOTDatasetForChart[]) {
  const t = get(i18n)
  const currentLocale = get(locale)

  return (d: ChartDataRaw) => {
    return `
    <div class="flex flex-col gap-1 bg-background rounded-lg border p-2 shadow-sm">
        <span class="font-bold text-sm text-muted-foreground">
        ${d.year}
        </span>
        ${datasets
          .map((dataset) => {
            const categoryLevelToDisplay =
              dataset.categories.subsubcategory ?? dataset.categories.subcategory

            const label =
              d[categoryLevelToDisplay] === ''
                ? t('unapplicale')
                : (d[categoryLevelToDisplay] ?? '').toLocaleString(currentLocale)

            return `
            <div class="flex flex-col">
                <span class="text-[0.70rem] uppercase text-muted-foreground">
                  ${t(categoryLevelToDisplay)}
                </span>
                <span class="font-bold text-foreground">
                  ${label}
                  <span class="font-normal text-xs text-muted-foreground">
                    ${dataset.unit ? t(dataset.unit) : ''}
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
