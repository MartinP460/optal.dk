<script lang="ts">
  import VisualizationChartLegend from './VisualizationChartLegend.svelte'
  import VisualizationChartSingle from '$lib/components/VisualizationChartSingle.svelte'
  import VisualizationTable from '$lib/components/VisualizationTable.svelte'
  import VisualizationChartXY from '$lib/components/VisualizationChartXY.svelte'
  import { getVisualizationState } from '$lib/utils/visualizationState.svelte'
  import { DisplayType } from '$lib/utils/categories'

  const { displayType } = $derived(getVisualizationState())
</script>

<figure class={displayType === DisplayType.Table ? 'mt-2' : 'mt-4'}>
  {#if displayType === DisplayType.Donutchart}
    <VisualizationChartSingle />
  {:else if displayType === DisplayType.Table}
    <VisualizationTable />
  {:else}
    <VisualizationChartXY />
  {/if}
  {#if displayType !== DisplayType.Table}
    <VisualizationChartLegend />
  {/if}
</figure>
