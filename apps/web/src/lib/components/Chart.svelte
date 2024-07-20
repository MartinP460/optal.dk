<script lang="ts">
  import {
    VisAxis,
    VisCrosshair,
    VisGroupedBar,
    VisLine,
    VisScatter,
    VisTooltip,
    VisXYContainer
  } from '@unovis/svelte'
  import type { KOTDataCategory } from 'parser'
  import type { DisplayType } from '$lib/types/chartDisplayType'
  import { getChartProps } from '$lib/utils/chartHelpers'
  import ChartLegend from '$lib/components/ChartLegend.svelte'

  export let dataCategory: KOTDataCategory
  export let displayType: Omit<DisplayType, 'table'>

  let innerWidth = 0

  $: ({ data, originalData, suggestedMaxY, legendLabels, y, x, tooltip, tickValues, color } =
    getChartProps(dataCategory))
</script>

<svelte:window bind:innerWidth />

<figure>
  <VisXYContainer class="min-h-80" height={320} yDomain={[0, suggestedMaxY]}>
    <VisTooltip />
    {#if displayType === 'linechart'}
      <VisLine {data} {x} {y} {color} />
      <VisScatter {data} {x} {y} {color} />
    {:else}
      <VisGroupedBar {data} {x} {y} {color} roundedCorners={4} />
    {/if}
    <VisCrosshair data={originalData} {x} {y} template={tooltip} {color} />
    <VisAxis type="x" gridLine={false} tickLine={false} tickValues={tickValues(innerWidth)} />
    <VisAxis type="y" domainLine={false} tickLine={false} />
  </VisXYContainer>
  <ChartLegend labels={legendLabels} />
</figure>
