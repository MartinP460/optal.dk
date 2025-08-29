<!--
  @component
  Charts for displaying 1-dimensional data (for a single year in our case).
-->
<script lang="ts">
  import { VisDonut, VisSingleContainer, VisTooltip } from '@unovis/svelte'
  import { getVisualizationSingleChartProps } from '$lib/utils/visualizationChart.svelte'

  let { data, centralLabel, value, color, triggers } = $derived(getVisualizationSingleChartProps())
</script>

<VisSingleContainer class="min-h-80" {data}>
  <VisDonut {value} {color} {centralLabel} arcWidth={50} />
  <VisTooltip {triggers} />
</VisSingleContainer>
