<script lang="ts">
  import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    type TooltipItem
  } from 'chart.js'
  import { Line } from 'svelte-chartjs'
  import type { KOTDataset } from 'parser'
  import { t } from '$lib/i18n'
  import { getLineColorFromDataset } from '$lib/utils/getLineColorFromName'

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
    lineTension: 0.3,
    borderColor: getLineColorFromDataset(dataset),
    pointRadius: 5,
    pointStyle: 'rectRounded',
    hitRadius: 12,
    pointBorderWidth: 0,
    pointBackgroundColor: getLineColorFromDataset(dataset)
  }))

  const tooltip = (item: TooltipItem<'line'> & { dataset: KOTDataset }) => {
    const dataset = selected.find((dataset) => dataset.id === item.dataset.id)

    if (!dataset) return ''

    const { data, categories, unit } = dataset

    const dataPoint = data[item.dataIndex] ?? $t('unknown')

    return ` ${$t(categories.subcategory)} - ${
      dataPoint !== '' ? dataPoint.toLocaleString() : $t('unapplicale')
    } ${unit ? $t(unit) : ''}`
  }

  $: maxY = selected.find((dataset) => selected.map(({ id }) => id).includes(dataset.id))?.max

  ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)
</script>

<figure class="mt-4">
  <Line
    height={320}
    data={{
      labels: selected[0].years,
      datasets: datasetsWithProperties.filter((dataset) =>
        selected.map(({ id }) => id).includes(dataset.id)
      )
    }}
    options={{
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#000'
          }
        },
        y: {
          beginAtZero: true,
          max: maxY,
          ticks: {
            color: '#000',
            maxTicksLimit: 10
          }
        }
      },
      defaults: {
        color: '#000000'
      },
      plugins: {
        legend: {
          onClick: null,
          position: 'bottom',
          align: 'start',
          labels: {
            usePointStyle: true
          }
        },
        tooltip: {
          animation: {
            duration: 200
          },
          backgroundColor: 'white',
          titleColor: 'black',
          bodyColor: 'black',
          borderWidth: 1,
          borderColor: '#d1d5db',
          yAlign: 'bottom',
          caretPadding: 6,
          callbacks: {
            label: tooltip
          }
        }
      },
      animation: {
        numbers: { duration: 0 },
        colors: {
          type: 'color',
          duration: 500,
          from: 'transparent'
        }
      }
    }}
  />
</figure>
