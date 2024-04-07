import _ from 'lodash'
import { get } from 'svelte/store'
import type { TooltipItem } from 'chart.js'
import type { KOTDataset } from 'parser'
import type { ChartBaseProps } from 'svelte-chartjs'
import { t as i18n, locale } from '$lib/i18n'

export const getChartOptions = (config: {
  isDark: boolean
  xOffset?: boolean
  minimumMax?: number
  maxY?: number
}) => {
  const gridColor = config.isDark ? '#374151' : '#e5e7eb' // gray.700 and gray.300 respectively
  const textColor = config.isDark ? 'white' : 'black'
  const tooltipColor = config.isDark ? '#18181b' : 'white'
  const tooltipBorderColor = config.isDark ? '#3f3f46' : '#d1d5db'

  // We need to set undefined properties to null, otherwise the options are
  // carried over from chart to chart.
  return _.merge(chartOptions, {
    scales: {
      x: {
        offset: config.xOffset ?? null,
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor
        }
      },
      y: {
        max: config.maxY ?? null,
        suggestedMax: config.minimumMax ?? null,
        ticks: {
          color: textColor
        },
        grid: {
          color: gridColor
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: config.isDark ? '#9ca3af' : '#4b5563'
        }
      },
      tooltip: {
        backgroundColor: tooltipColor,
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: tooltipBorderColor
      }
    }
  })
}

const tooltip = (
  item: TooltipItem<'line'> & { dataset: KOTDataset & { dataLabels?: (string | number)[] } }
) => {
  const t = get(i18n)
  const currentLocale = get(locale)

  const { data, categories, unit, dataLabels } = item.dataset
  const dataPoint = data[item.dataIndex]
  const dataLabel =
    dataLabels && dataLabels[item.dataIndex] !== '' ? dataLabels[item.dataIndex] : t('unapplicale')
  const label = dataPoint ? dataPoint : dataLabel

  return ` ${t(categories.subcategory)} - ${label.toLocaleString(currentLocale)} ${unit ? t(unit) : ''}`
}

const chartOptions: ChartBaseProps['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  datasets: {
    line: {
      pointStyle: 'rectRounded',
      pointRadius: 5,
      pointBorderWidth: 0
    },
    bar: {
      borderRadius: 2,
      pointStyle: 'rectRounded'
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        maxTicksLimit: 10
      }
    }
  },
  defaults: {
    color: '#000000'
  },
  plugins: {
    legend: {
      // @ts-expect-error Setting it to null is the only way to disable toggling.
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
    // @ts-expect-error It's lying to you.
    numbers: { duration: 0 }
  }
}
