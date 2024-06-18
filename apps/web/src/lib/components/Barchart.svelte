<script lang="ts">
  import type { KOTDataset } from 'parser'
  import {
    addDatasetsProperties,
    computeSuggestedMaxY,
    formatData,
    getColorFunction,
    getTooltip,
    getXFunction,
    getYFunctions
  } from '$lib/utils/chartHelpers'
  import { VisAxis, VisCrosshair, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/svelte'

  export let datasets: KOTDataset[]

  $: cleanedDataset = addDatasetsProperties(datasets)
  $: data = formatData(cleanedDataset)

  $: x = getXFunction()
  $: y = getYFunctions(datasets)

  $: suggestedMaxY = computeSuggestedMaxY(cleanedDataset)

  $: color = getColorFunction(datasets)
  $: tooltip = getTooltip(cleanedDataset)
</script>

<figure>
  <VisXYContainer {data} height={320} yDomain={[0, suggestedMaxY]}>
    <VisTooltip />
    <VisGroupedBar {x} {y} {color} roundedCorners={4} />
    <VisCrosshair {x} {y} template={tooltip} {color} />
    <VisAxis type="x" gridLine={false} tickLine={false} />
    <VisAxis type="y" domainLine={false} tickLine={false} />
  </VisXYContainer>
</figure>
