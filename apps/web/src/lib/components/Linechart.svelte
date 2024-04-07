<script lang="ts">
  import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip
  } from 'chart.js'
  import { Line } from 'svelte-chartjs'
  import { mode } from 'mode-watcher'
  import type { KOTDataset } from 'parser'
  import { t } from '$lib/i18n'
  import { getColorFromDataset } from '$lib/utils/getColorFromDataset'
  import { getChartOptions } from '$lib/utils/getChartOptions'
  import { noTypeCheck } from '$lib/utils/noTypeCheck'

  export let selected: KOTDataset[]

  const hasLetters = /[a-zA-Z]/
  $: datasetsWithProperties = selected.map((dataset) => ({
    ...dataset,
    data: dataset.data.map((datapoint) =>
      typeof datapoint === 'string'
        ? hasLetters.test(datapoint) || datapoint === ''
          ? 0
          : parseFloat(datapoint.replace(',', '.'))
        : datapoint
    ),
    label: $t(dataset.categories.subcategory),
    dataLabels: dataset.data,
    borderColor: getColorFromDataset(dataset),
    pointBackgroundColor: getColorFromDataset(dataset),
    hitRadius: 12,
    lineTension: 0.3
  }))

  $: maxY = selected.find((dataset) => selected.map(({ id }) => id).includes(dataset.id))?.max

  $: options = getChartOptions({
    isDark: $mode === 'dark',
    maxY
  })

  ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)
</script>

<figure>
  <Line
    height={320}
    data={{
      labels: selected[0].years,
      datasets: datasetsWithProperties
    }}
    options={noTypeCheck(options)}
  />
</figure>
