<script lang="ts">
  import type { KOTDataCategories, KOTDataCategory } from 'parser'
  import type { DisplayType } from '$lib/types/chartDisplayType'
  import Table from '$lib/components/Table.svelte'
  import Chart from '$lib/components/Chart.svelte'
  import { getCategoryParams } from '$lib/utils/visualizationCategoryParams'
  import { getCategoryInPeriod } from '$lib/utils/chartCategoryHelpers'
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
  const initialDisplayType = has5OrMoreYearsOfData
    ? chartConfig[initialDataCategory.name].defaultDisplayType
    : 'table'

  let period = [minYear, maxYear]
  let displayType: DisplayType = initialDisplayType

  $: selectedDataCategory = initialDataCategory

  const handleCategorySelect = (dataCategory: KOTDataCategory) => {
    if (selectedDataCategory?.name !== dataCategory?.name && has5OrMoreYearsOfData) {
      displayType = chartConfig[dataCategory.name].defaultDisplayType
    }

    selectedDataCategory = getCategoryInPeriod(
      dataCategory,
      dataCategories[dataCategory.name]!,
      period
    )

    setCategoryParam(dataCategory.name)
  }

  const handleDisplayTypeSelect = (value: DisplayType) => {
    displayType = value
    period = [minYear, maxYear]
  }

  const handlePeriodChange = (value: number[]) => {
    const sortedPeriod = value.sort()

    selectedDataCategory = getCategoryInPeriod(
      selectedDataCategory,
      dataCategories[selectedDataCategory.name]!,
      sortedPeriod
    )

    period = sortedPeriod
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
