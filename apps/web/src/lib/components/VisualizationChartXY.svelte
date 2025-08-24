<!--
  @component
  Charts for displaying 2-dimensional data (for multiple years in our case).
-->
<script lang="ts">
  import {
    VisAxis,
    VisCrosshair,
    VisGroupedBar,
    VisLine,
    VisScatter,
    VisStackedBar,
    VisTooltip,
    VisXYContainer
  } from '@unovis/svelte'
  import { getVisualizationState } from '$lib/utils/visualizationState.svelte'
  import { getVisualizationChartXYProps } from '$lib/utils/visualizationChart.svelte'
  import { DisplayType } from '$lib/utils/categories'

  let innerWidth = $state(0)

  const { category, displayType } = $derived(getVisualizationState())
  const { data, originalData, x, y, maxY, tooltip, color, tickValues } = $derived(
    getVisualizationChartXYProps()
  )
</script>

<svelte:window bind:innerWidth />

<VisXYContainer key={data} class="min-h-80" height={320} yDomain={[0, maxY]}>
  <VisTooltip />
  <VisAxis type="y" domainLine={false} tickLine={false} />
  <VisAxis type="x" gridLine={false} tickLine={false} tickValues={tickValues(innerWidth ?? 0)} />
  {#if displayType === DisplayType.LineChart}
    <VisLine {data} {x} {y} {color} />
    <VisScatter {data} {x} {y} {color} />
  {:else if category.isStackedBarChart}
    <VisStackedBar {data} {x} {y} {color} roundedCorners={4} barPadding={0.2} />
  {:else}
    <VisGroupedBar {data} {x} {y} {color} roundedCorners={4} dataStep={1} />
  {/if}
  <VisCrosshair data={originalData} {x} {y} template={tooltip} {color} />
</VisXYContainer>
