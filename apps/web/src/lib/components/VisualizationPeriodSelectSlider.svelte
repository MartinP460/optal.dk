<script lang="ts">
  import _ from 'lodash'
  import { Slider } from '$lib/components/ui/slider'
  import { getVisualizationState } from '$lib/utils/visualizationState.svelte'
  import { DisplayType } from '$lib/utils/categories'

  let { data, category, period, onPeriodChange } = $derived(getVisualizationState())

  const courseYears = $derived(data.map((datapoint) => datapoint.year))
  const min = $derived(Math.min(...courseYears))
  const max = $derived(Math.max(...courseYears))

  const mode = $derived(
    category.defaultDisplayType === DisplayType.Donutchart ? 'single' : 'multiple'
  )
  const periodState = $derived(mode === 'single' ? period[0] : period)

  const handlePeriodChange = (value: number[] | number) => {
    const newValue = (typeof value === 'number' ? [value, value] : value) as [number, number]
    onPeriodChange(newValue)
  }
</script>

<div class="flex flex-col items-center mt-2 mx-2">
  {#if mode === 'single'}
    <Slider
      type="single"
      {min}
      {max}
      step={1}
      value={periodState as number}
      onValueChange={handlePeriodChange}
    />
  {:else}
    <Slider
      type="multiple"
      {min}
      {max}
      step={1}
      value={periodState as number[]}
      onValueChange={handlePeriodChange}
    />
  {/if}
  <div class="flex w-[108%] justify-between mt-2 text-xs">
    {#each courseYears as year (year)}
      <span class="text-muted-foreground hidden first:inline last:inline">{year}</span>
    {/each}
  </div>
</div>
