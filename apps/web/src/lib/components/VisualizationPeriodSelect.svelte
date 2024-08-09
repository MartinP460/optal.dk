<script lang="ts">
  import { IconTimeline } from '@tabler/icons-svelte'
  import { t } from '$lib/i18n'
  import * as Popover from '$lib/components/ui/popover'
  import * as Drawer from '$lib/components/ui/drawer'
  import Button from '$lib/components/ui/button/button.svelte'
  import VisualizationPeriodSelectSlider from '$lib/components/VisualizationPeriodSelectSlider.svelte'

  export let min: number
  export let max: number
  export let period: number[]

  $: label =
    period.length < 2 || period[0] === period[1] ? period[0] : `${period[0]} - ${period[1]}`
</script>

<Popover.Root>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="hidden md:flex h-12 w-36">
      <IconTimeline class="w-5 h-5 mr-3" stroke={1.75} />
      <div class="text-left">
        <p class="text-xs text-muted-foreground">{$t('timePeriod')}</p>
        <p class="inline-flex gap-2 items-center">
          {label}
        </p>
      </div>
    </Button>
  </Popover.Trigger>
  <Popover.Content class="flex flex-col text-center w-80">
    <p class="text-sm tracking-tight text-muted-foreground">{$t('selectTimePeriod')}</p>
    <VisualizationPeriodSelectSlider {period} {min} {max} on:periodChange />
  </Popover.Content>
</Popover.Root>

<Drawer.Root>
  <Drawer.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="flex md:hidden h-12 w-36">
      <IconTimeline class="w-5 h-5 mr-3" stroke={1.75} />
      <div class="text-left">
        <p class="text-xs text-muted-foreground">{$t('timePeriod')}</p>
        <p class="inline-flex gap-2 items-center">
          {label}
        </p>
      </div>
    </Button>
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>{$t('timePeriod')}</Drawer.Title>
      <Drawer.Description>{$t('timePeriodSelect')}</Drawer.Description>
    </Drawer.Header>
    <div class="px-6 py-2">
      <VisualizationPeriodSelectSlider {period} {min} {max} on:periodChange />
    </div>
    <Drawer.Footer>
      <Drawer.Close asChild let:builder>
        <Button builders={[builder]}>{$t('seeChanges')}</Button>
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
