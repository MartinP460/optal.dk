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
  import type { KOTDataCategory } from '@optaldk/reader'
  import type { DisplayType } from '$lib/utils/chartCategoryHelpers'
  import { getChartProps } from '$lib/utils/chartHelpers'

  let innerWidth = $state(0)

  type Props = {
    dataCategory: KOTDataCategory
    displayType: DisplayType
  }

  let { dataCategory, displayType }: Props = $props()

  let { data, originalData, x, y, color, tooltip, suggestedMaxY, tickValues } = $derived(
    getChartProps(dataCategory, displayType)
  )
</script>

<svelte:window bind:innerWidth />

<VisXYContainer key={dataCategory} class="min-h-80" height={320} yDomain={[0, suggestedMaxY]}>
  <VisTooltip />
  <VisAxis type="y" domainLine={false} tickLine={false} />
  <VisAxis type="x" gridLine={false} tickLine={false} tickValues={tickValues(innerWidth ?? 0)} />
  {#if displayType === 'linechart'}
    <VisLine {data} {x} {y} {color} />
    <VisScatter {data} {x} {y} {color} />
  {:else if dataCategory.name === 'gender' || dataCategory.name === 'age' || dataCategory.name === 'education'}
    <VisStackedBar {data} {x} {y} {color} roundedCorners={4} barPadding={0.2} />
  {:else}
    <VisGroupedBar {data} {x} {y} {color} roundedCorners={4} dataStep={1} />
  {/if}
  <VisCrosshair data={originalData} {x} {y} template={tooltip} {color} />
</VisXYContainer>
