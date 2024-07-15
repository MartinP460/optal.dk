<script lang="ts">
  import { VisAxis, VisCrosshair, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/svelte'
  import type { NewKOTDataCategory } from '$lib/utils/transformInstitutionsToNewFormat'
  import { getChartProps } from '$lib/utils/chartHelpers'
  import ChartLegend from '$lib/components/ChartLegend.svelte'

  export let dataCategory: NewKOTDataCategory

  $: ({ data, suggestedMaxY, legendLabels, y, x, tooltip, color } = getChartProps(dataCategory))
</script>

<figure>
  <VisXYContainer height={320} yDomain={[0, suggestedMaxY]}>
    <VisTooltip />
    <VisGroupedBar {data} {x} {y} {color} roundedCorners={4} />
    <VisCrosshair {data} {x} {y} template={tooltip} {color} />
    <VisAxis type="x" gridLine={false} tickLine={false} />
    <VisAxis type="y" domainLine={false} tickLine={false} />
  </VisXYContainer>
  <ChartLegend labels={legendLabels} />
</figure>
