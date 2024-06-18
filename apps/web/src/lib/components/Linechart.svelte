<script lang="ts">
  import {
    VisAxis,
    VisCrosshair,
    VisLine,
    VisScatter,
    VisTooltip,
    VisXYContainer
  } from '@unovis/svelte'
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

  export let datasets: KOTDataset[]

  $: cleanedDataset = addDatasetsProperties(datasets)
  $: data = formatData(cleanedDataset)
  $: datasetsWithOriginalData = formatData(datasets.sort((a, b) => a.id - b.id))

  $: x = getXFunction()
  $: y = getYFunctions(datasets)

  $: suggestedMaxY = computeSuggestedMaxY(cleanedDataset)

  $: color = getColorFunction(datasets)
  $: tooltip = getTooltip(cleanedDataset)
</script>

<figure>
  <VisXYContainer height={320} yDomain={[0, suggestedMaxY]}>
    <VisTooltip />
    <VisLine {data} {x} {y} {color} />
    <VisScatter {data} {x} {y} {color} />
    <VisCrosshair data={datasetsWithOriginalData} {x} {y} template={tooltip} {color} />
    <VisAxis type="x" gridLine={false} tickLine={false} />
    <VisAxis type="y" domainLine={false} tickLine={false} />
  </VisXYContainer>
</figure>
