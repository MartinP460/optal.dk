<script lang="ts">
  import type { KOTData } from '@optaldk/reader'
  import VisualizationChart from '$lib/components/VisualizationChart.svelte'
  import VisualizationPeriodSelect from '$lib/components/VisualizationPeriodSelect.svelte'
  import VisualizationCategorySelect from '$lib/components/VisualizationCategorySelect.svelte'
  import VisualizationDisplaySelect from '$lib/components/VisualizationDisplaySelect.svelte'
  import { getVisualizationState, initVisualization } from '$lib/utils/visualizationState.svelte'
  import { CategoryLabel, DisplayType } from '$lib/utils/categories'

  type Props = {
    data: KOTData['data']
    categoriesToDisplay: CategoryLabel[]
  }

  let { data: initialData, categoriesToDisplay }: Props = $props()

  initVisualization(initialData, categoriesToDisplay)
  const { category, displayType } = $derived(getVisualizationState())

  const has5YearsOfData = initialData.length > 4
</script>

<div class="mt-8 sm:mt-8">
  <div class="flex gap-4 w-full py-2 px-1 overflow-x-auto">
    <VisualizationCategorySelect />
    {#if displayType !== DisplayType.Table && (has5YearsOfData || category.defaultDisplayType === DisplayType.Donutchart)}
      <VisualizationPeriodSelect />
    {/if}
    {#if has5YearsOfData || category.defaultDisplayType === DisplayType.Donutchart}
      <VisualizationDisplaySelect />
    {/if}
  </div>
  <VisualizationChart />
</div>
