<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { t } from '$lib/i18n'
  import * as Popover from '$lib/components/ui/popover'
  import Button from '$lib/components/ui/button/button.svelte'
  import VisualizationPeriodSlider from '$lib/components/VisualizationPeriodSlider.svelte'

  export let min: number
  export let max: number
  export let period: number[]

  const dispatch = createEventDispatcher<{
    periodChange: number[]
  }>()
</script>

<Popover.Root>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="hidden md:block"
      >{$t('timePeriod')}</Button
    >
  </Popover.Trigger>
  <Popover.Content class="flex flex-col text-center w-80">
    <p class="text-sm tracking-tight text-muted-foreground">{$t('selectTimePeriod')}</p>
    <VisualizationPeriodSlider
      {period}
      {min}
      {max}
      on:periodChange={(e) => dispatch('periodChange', e.detail)}
    />
  </Popover.Content>
</Popover.Root>
