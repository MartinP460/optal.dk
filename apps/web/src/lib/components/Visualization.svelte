<script lang="ts">
  import type { KOTDataCategories, KOTDataCategory } from 'reader'
  import type { DisplayType } from '$lib/utils/chartCategoryHelpers'
  import Table from '$lib/components/Table.svelte'
  import Chart from '$lib/components/Chart.svelte'
  import { getCategoryParams } from '$lib/utils/visualizationCategoryParams'
  import {
    getCategoryInPeriod,
    isDefaultSingleCategory,
    isDisplayTypeSingleCategory
  } from '$lib/utils/chartCategoryHelpers'
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
  const initialDisplayType =
    has5OrMoreYearsOfData || isDefaultSingleCategory(initialDataCategory.name)
      ? chartConfig[initialDataCategory.name].defaultDisplayType
      : 'table'
  const initalPeriod = isDisplayTypeSingleCategory(initialDisplayType)
    ? [maxYear, maxYear]
    : [minYear, maxYear]

  let period = initalPeriod
  let displayType: DisplayType = initialDisplayType
  $: selectedDataCategory = initialDataCategory

  const handleCategorySelect = (dataCategory: KOTDataCategory) => {
    const hasChangedCategory = selectedDataCategory.name !== dataCategory.name

    const hasChangedToMultipleCategory =
      isDisplayTypeSingleCategory(displayType) &&
      !isDefaultSingleCategory(dataCategory.name) &&
      hasChangedCategory

    const hasChangedToSingleCategory =
      isDefaultSingleCategory(dataCategory.name) &&
      !isDisplayTypeSingleCategory(displayType) &&
      hasChangedCategory

    if (hasChangedToMultipleCategory) {
      period = [minYear, period[1]]
    } else if (hasChangedToSingleCategory) {
      period = [period[1], period[1]]
    }

    if (hasChangedCategory) {
      if (has5OrMoreYearsOfData || isDefaultSingleCategory(dataCategory.name)) {
        displayType = chartConfig[dataCategory.name].defaultDisplayType
      } else if (!has5OrMoreYearsOfData) {
        displayType = 'table'
      }
    }

    selectedDataCategory = getCategoryInPeriod(
      dataCategory,
      dataCategories[dataCategory.name]!,
      period
    )

    setCategoryParam(dataCategory.name)
  }

  const handleDisplayTypeSelect = (value: DisplayType) => {
    if (isDisplayTypeSingleCategory(value)) {
      period = [maxYear, maxYear]
    } else {
      period = [minYear, maxYear]
    }

    selectedDataCategory = getCategoryInPeriod(
      selectedDataCategory,
      dataCategories[selectedDataCategory.name]!,
      period
    )

    displayType = value
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
    {#if displayType !== 'table' && (has5OrMoreYearsOfData || isDefaultSingleCategory(selectedDataCategory.name))}
      <VisualizationPeriodSelect
        {period}
        min={minYear}
        max={maxYear}
        mode={isDisplayTypeSingleCategory(displayType) ? 'single' : 'multiple'}
        on:periodChange={(e) => handlePeriodChange(e.detail)}
      />
    {/if}
    {#if has5OrMoreYearsOfData || isDefaultSingleCategory(selectedDataCategory.name)}
      <VisualizationDisplaySelect
        {selectedDataCategory}
        selectedDisplayType={displayType}
        on:displayTypeSelect={(e) => handleDisplayTypeSelect(e.detail)}
      />
    {/if}
  </div>
  <div class={displayType === 'table' ? 'mt-2' : 'mt-4'}>
    {#if displayType === 'table'}
      <Table dataCategory={selectedDataCategory} />
    {:else}
      <Chart {displayType} dataCategory={selectedDataCategory} {period} />
    {/if}
  </div>
</div>
