<script lang="ts">
  import type { KOTDataCategories, KOTDataCategory } from 'parser'
  import type { DisplayType } from '$lib/types/chartDisplayType'
  import Table from '$lib/components/Table.svelte'
  import Chart from '$lib/components/Chart.svelte'
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
    if (selectedDataCategory?.name !== dataCategory?.name && has5OrMoreYearsOfData) {
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
    const sortedValue = value.sort()

    const category = getFullPeriodDataset(
      selectedDataCategory,
      dataCategories[selectedDataCategory.name]!
    )

    const lower = category.datasets.findIndex((dataset) => dataset.year === sortedValue[0])
    const upper = category.datasets.reduce(
      (acc, item, i) => (item.year <= sortedValue[1] ? i : acc),
      -1
    )

    const newDataset = category.datasets.slice(lower, upper + 1)

    selectedDataCategory = {
      ...category,
      datasets: newDataset.length === 0 ? selectedDataCategory.datasets : newDataset
    } as KOTDataCategory
    period = sortedValue
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
    {#if displayType === 'table'}
      <Table dataCategory={selectedDataCategory} />
    {:else}
      <Chart {displayType} dataCategory={selectedDataCategory} />
    {/if}
  </div>
</div>
