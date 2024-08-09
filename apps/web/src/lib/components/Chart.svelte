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
  import type { KOTDataCategory } from 'parser'
  import type { DisplayType } from '$lib/types/chartDisplayType'
  import { getChartProps } from '$lib/utils/chartHelpers'
  import ChartLegend from '$lib/components/ChartLegend.svelte'

  export let dataCategory: KOTDataCategory
  export let displayType: DisplayType

  let innerWidth = 0

  $: ({ data, originalData, x, y, color, tooltip, suggestedMaxY, legendLabels, tickValues } =
    getChartProps(dataCategory, displayType))
</script>

<svelte:window bind:innerWidth />

<figure>
  <VisXYContainer class="min-h-80" height={320} yDomain={[0, suggestedMaxY]}>
    <VisTooltip />
    <VisAxis type="y" domainLine={false} tickLine={false} />
    <VisAxis type="x" gridLine={false} tickLine={false} tickValues={tickValues(innerWidth ?? 0)} />
    {#if displayType === 'linechart'}
      <VisLine {data} {x} {y} {color} />
      <VisScatter {data} {x} {y} {color} />
    {:else if dataCategory.name === 'gender' || dataCategory.name === 'age'}
      <VisStackedBar {data} {x} {y} {color} roundedCorners={4} barPadding={0.2} />
    {:else}
      <VisGroupedBar {data} {x} {y} {color} roundedCorners={4} dataStep={1} />
    {/if}
    <VisCrosshair data={originalData} {x} {y} template={tooltip} {color} />
  </VisXYContainer>
  <ChartLegend group={legendLabels.group} labels={legendLabels.labels} />
</figure>
