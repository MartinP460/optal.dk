<script lang="ts">
  import type { KOTDataCategories, KOTDataCategory } from 'parser'
  import type { DisplayType } from '$lib/types/chartDisplayType'
  import Linechart from '$lib/components/Linechart.svelte'
  import Table from '$lib/components/Table.svelte'
  import Barchart from '$lib/components/Barchart.svelte'
  import { getCategoryParams } from '$lib/utils/visualizationCategoryParams'
  import { getFullPeriodDataset } from '$lib/utils/chartCategoryHelpers'
  import VisualizationPeriodSelect from '$lib/components/VisualizationPeriodSelect.svelte'
  import VisualizationCategorySelect from '$lib/components/VisualizationCategorySelect.svelte'
  import VisualizationDisplaySelect from '$lib/components/VisualizationDisplaySelect.svelte'
  import { chartConfig } from '$lib/utils/chartConfig'

  export let dataCategories: KOTDataCategories

  const has5OrMoreYearsOfData = (dataCategories.accepted?.datasets.length ?? 0) > 4
  const courseYears = (dataCategories.accepted?.datasets ?? []).map((datapoint) => datapoint.year)
  const minYear = Math.min(...courseYears)
  const maxYear = Math.max(...courseYears)
  const { initialDataCategory, setCategoryParam } = getCategoryParams(dataCategories)

  let displayType: DisplayType = has5OrMoreYearsOfData
    ? chartConfig[initialDataCategory.name].defaultDisplayType
    : 'table'

  let period = [minYear, maxYear]

  $: selectedDataCategory = initialDataCategory

  const handleCategorySelect = (dataCategory: KOTDataCategory) => {
    if (selectedDataCategory?.name !== dataCategory?.name) {
      displayType = chartConfig[dataCategory.name].defaultDisplayType
    }

    selectedDataCategory = dataCategory
    setCategoryParam(dataCategory.name)
  }

  const handleDisplayTypeSelect = (value: DisplayType) => {
    displayType = value
    period = [minYear, maxYear]
  }

  const handlePeriodChange = (value: number[]) => {
    const category = getFullPeriodDataset(
      selectedDataCategory,
      dataCategories[selectedDataCategory.name]!
    )

    const minYearDiff = value[0] > minYear ? value[0] - minYear : minYear - value[0]
    const maxYearDiff = value[1] > maxYear ? value[1] - maxYear : maxYear - value[1]

    selectedDataCategory = {
      ...category,
      datasets: category.datasets.slice(minYearDiff, maxYear - minYear - maxYearDiff + 1)
    } as KOTDataCategory
    period = value
  }
</script>

<div class="mt-8 sm:mt-8">
  <div class="flex gap-4 w-full overflow-x-scroll py-2 px-1">
    <VisualizationCategorySelect
      {dataCategories}
      {selectedDataCategory}
      on:categorySelect={(e) => handleCategorySelect(e.detail)}
    />
    {#if displayType !== 'table' && has5OrMoreYearsOfData}
      <VisualizationPeriodSelect
        {period}
        min={minYear}
        max={maxYear}
        on:periodChange={(e) => handlePeriodChange(e.detail)}
      />
    {/if}
    {#if has5OrMoreYearsOfData}
      <VisualizationDisplaySelect
        {selectedDataCategory}
        selectedDisplayType={displayType}
        on:displayTypeSelect={(e) => handleDisplayTypeSelect(e.detail)}
      />
    {/if}
  </div>
  <div class="mt-2">
    {#if displayType === 'barchart'}
      <Barchart dataCategory={selectedDataCategory} />
    {:else if displayType === 'linechart'}
      <Linechart dataCategory={selectedDataCategory} />
    {:else}
      <Table dataCategory={selectedDataCategory} />
    {/if}
  </div>
</div>
