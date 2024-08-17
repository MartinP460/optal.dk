<!--
  @component
  Charts for displaying 1-dimensional data (for a single year in our case).
-->
<script lang="ts">
  import { VisDonut, VisSingleContainer, VisTooltip } from '@unovis/svelte'
  import { getSingleChartProps } from '$lib/utils/chartHelpers'
  import type { KOTDataCategory } from 'parser'

  export let dataCategory: KOTDataCategory
  export let period: number[]

  $: ({ data, value, color, triggers } = getSingleChartProps(dataCategory, period[1]))
</script>

<VisSingleContainer class="min-h-80" {data}>
  <VisDonut {value} {color} centralLabel={period[1]} arcWidth={50} />
  <VisTooltip {triggers} />
</VisSingleContainer>
