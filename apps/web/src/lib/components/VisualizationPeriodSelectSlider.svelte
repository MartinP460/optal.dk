<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import _ from 'lodash'
  import { Slider } from '$lib/components/ui/slider'

  export let min: number
  export let max: number
  export let period: number[]
  export let mode: 'single' | 'multiple'

  const dispatch = createEventDispatcher<{
    periodChange: number[]
  }>()

  const handlePeriodChange = (value: number[]) => {
    const newValue = value.length === 1 ? [value[0], value[0]] : value

    dispatch('periodChange', newValue)
  }
</script>

<div class="flex flex-col items-center mt-2 mx-2">
  <Slider
    value={mode === 'single' ? [period[1]] : period}
    onValueChange={handlePeriodChange}
    {min}
    {max}
    step={1}
  />
  <div class="flex w-[108%] justify-between mt-2 text-xs">
    {#each _.range(min, max + 1) as year}
      <span class="text-muted-foreground hidden first:inline last:inline">{year}</span>
    {/each}
  </div>
</div>
