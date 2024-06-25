import type { KOTCategory } from 'parser'

type ChartVariants = 'line' | 'bar' | 'table'
type ChartConfig = {
  [key in KOTCategory]: {
    [key in ChartVariants]?: {
      periodSelector?: 'multiple' | 'single' | null
    }
  }
}

export const chartConfig: ChartConfig = {
  accepted: {
    line: {
      periodSelector: 'multiple'
    },
    bar: {
      periodSelector: 'multiple'
    },
    table: {}
  },
  applied: {
    line: {
      periodSelector: 'multiple'
    },
    bar: {
      periodSelector: 'multiple'
    },
    table: {}
  },
  quotient: {
    line: {
      periodSelector: 'multiple'
    },
    bar: {
      periodSelector: 'multiple'
    },
    table: {}
  },
  gender: {
    line: {
      periodSelector: 'multiple'
    },
    bar: {
      periodSelector: 'multiple'
    },
    table: {}
  }
}
