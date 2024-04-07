<script lang="ts">
  import { Bar } from 'svelte-chartjs'
  import { BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from 'chart.js'
  import { mode } from 'mode-watcher'
  import type { KOTDataset } from 'parser'
  import { getChartOptions } from '$lib/utils/getChartOptions'
  import { noTypeCheck } from '$lib/utils/noTypeCheck'
  import { getColorFromDataset } from '$lib/utils/getColorFromDataset'
  import { t } from '$lib/i18n'

  export let datasets: KOTDataset[]

  const hasLetters = /[a-zA-Z]/
  $: labels = datasets[0].years
  $: datasetsWithProperties = datasets
    .map((dataset) => ({
      ...dataset,
      label: $t(dataset.categories.subcategory),
      data: dataset.data.map((datapoint) =>
        typeof datapoint === 'string'
          ? hasLetters.test(datapoint) || datapoint === ''
            ? 0
            : parseFloat(datapoint.replace(',', '.'))
          : datapoint
      ),
      hitRadius: 12,
      backgroundColor: getColorFromDataset(dataset)
    }))
    .sort((a, b) => (a.id < b.id ? -1 : 1))

  $: options = getChartOptions({
    isDark: $mode === 'dark',
    xOffset: true,
    minimumMax: 10
  })

  Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
</script>

<figure>
  <Bar
    height={320}
    data={{
      labels,
      datasets: datasetsWithProperties
    }}
    options={noTypeCheck(options)}
  />
</figure>
