<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import * as Drawer from '$lib/components/ui/drawer'
  import Button from '$lib/components/ui/button/button.svelte'
  import { t } from '$lib/i18n'
  import VisualizationPeriodSlider from '$lib/components/VisualizationPeriodSlider.svelte'

  export let min: number
  export let max: number
  export let period: number[]

  const dispatch = createEventDispatcher<{
    periodChange: number[]
  }>()
</script>

<Drawer.Root>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="h-full">{$t('timePeriod')}</Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Tidsperiode</Drawer.Title>
      <Drawer.Description>Vælg tidsperiode.</Drawer.Description>
    </Drawer.Header>
    <div class="px-6 py-2">
      <VisualizationPeriodSlider
        {period}
        {min}
        {max}
        on:periodChange={(e) => dispatch('periodChange', e.detail)}
      />
    </div>
    <Drawer.Footer>
      <Drawer.Close asChild let:builder>
        <Button builders={[builder]}>{$t('seeChanges')}</Button>
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
