<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import _ from 'lodash'
  import { Slider } from '$lib/components/ui/slider'
  import { t } from '$lib/i18n'
  import * as Popover from '$lib/components/ui/popover'
  import Button from '$lib/components/ui/button/button.svelte'

  export let min: number
  export let max: number
  export let period: number[]

  const dispatch = createEventDispatcher<{
    periodChange: number[]
  }>()
</script>

<Popover.Root>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="">{$t('timePeriod')}</Button>
  </Popover.Trigger>
  <Popover.Content class="flex flex-col text-center w-80">
    <p class="text-sm tracking-tight text-muted-foreground">{$t('selectTimePeriod')}</p>
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
  </Popover.Content>
</Popover.Root>
