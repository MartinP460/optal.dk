<script lang="ts">
  import _ from 'lodash'
  import { Slider } from '$lib/components/ui/slider'

  type Props = {
    min: number
    max: number
    period: number[]
    mode: 'single' | 'multiple'
    onPeriodChange: (value: number[]) => void
  }

  let { min, max, period, mode, onPeriodChange }: Props = $props()

  // Some of these bindings may be excessive, although this way we don't get errors in the browser console.
  let periodState = $state(mode === 'single' ? period[0] : period)

  const handlePeriodChange = (value: number[] | number) => {
    const newValue = typeof value === 'number' ? [value, value] : value
    if (mode === 'single') {
      periodState = newValue[0]
    } else {
      periodState = newValue
    }
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
      bind:value={periodState as number}
      onValueChange={handlePeriodChange}
    />
  {:else}
    <Slider
      type="multiple"
      {min}
      {max}
      step={1}
      bind:value={periodState as number[]}
      onValueChange={handlePeriodChange}
    />
  {/if}
  <div class="flex w-[108%] justify-between mt-2 text-xs">
    {#each _.range(min, max + 1) as year}
      <span class="text-muted-foreground hidden first:inline last:inline">{year}</span>
    {/each}
  </div>
</div>
