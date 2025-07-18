<!--
  @component
  Charts for displaying 1-dimensional data (for a single year in our case).
-->
<script lang="ts">
  import { VisDonut, VisSingleContainer, VisTooltip } from '@unovis/svelte'
  import type { KOTDataCategory } from '@optaldk/reader'
  import { getSingleChartProps } from '$lib/utils/chartHelpers'

  type Props = {
    dataCategory: KOTDataCategory
    period: number[]
  }

  let { dataCategory, period }: Props = $props()

  let { data, centralLabel, value, color, triggers } = $derived(
    getSingleChartProps(dataCategory, period[1])
  )
</script>

<VisSingleContainer class="min-h-80" {data}>
  <VisDonut {value} {color} {centralLabel} arcWidth={50} />
  <VisTooltip {triggers} />
</VisSingleContainer>
