<script lang="ts">
  import {
    VisAxis,
    VisCrosshair,
    VisLine,
    VisScatter,
    VisTooltip,
    VisXYContainer
  } from '@unovis/svelte'
  import type { NewKOTDataCategory } from '$lib/utils/transformInstitutionsToNewFormat'
  import { getChartProps } from '$lib/utils/chartHelpers'
  import ChartLegend from '$lib/components/ChartLegend.svelte'

  export let dataCategory: NewKOTDataCategory

  $: ({ data, originalData, suggestedMaxY, legendLabels, y, x, tooltip, color } =
    getChartProps(dataCategory))
</script>

<figure>
  <VisXYContainer height={320} yDomain={[0, suggestedMaxY]}>
    <VisTooltip />
    <VisLine {data} {x} {y} {color} />
    <VisScatter {data} {x} {y} {color} />
    <VisCrosshair data={originalData} {x} {y} template={tooltip} {color} />
    <VisAxis type="x" gridLine={false} tickLine={false} />
    <VisAxis type="y" domainLine={false} tickLine={false} />
  </VisXYContainer>
  <ChartLegend labels={legendLabels} />
</figure>
