<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import _ from 'lodash'
  import { Slider } from '$lib/components/ui/slider'

  export let min: number
  export let max: number
  export let period: number[]

  const dispatch = createEventDispatcher<{
    periodChange: number[]
  }>()
</script>

<div class="flex flex-col items-center mt-2 mx-2">
  <Slider
    value={period}
    onValueChange={(value) => dispatch('periodChange', value)}
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
