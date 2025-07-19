<script lang="ts">
  import { IconTimeline } from '@tabler/icons-svelte'
  import { t } from '$lib/i18n/index.svelte'
  import * as Popover from '$lib/components/ui/popover'
  import * as Drawer from '$lib/components/ui/drawer'
  import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte'
  import VisualizationPeriodSelectSlider from '$lib/components/VisualizationPeriodSelectSlider.svelte'

  type Props = {
    min: number
    max: number
    period: number[]
    mode: 'single' | 'multiple'
    onPeriodChange: (value: number[]) => void
  }

  let { min, max, period, mode, onPeriodChange }: Props = $props()

  let label = $derived(
    period.length < 2 || period[0] === period[1] ? period[0] : `${period[0]} - ${period[1]}`
  )
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" class="hidden md:flex h-12 w-36">
        <IconTimeline class="w-5 h-5 mr-3" stroke={1.75} />
        <div class="text-left">
          <p class="text-xs text-muted-foreground">{t('timePeriod')}</p>
          <p class="inline-flex gap-2 items-center">
            {label}
          </p>
        </div>
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="flex flex-col text-center w-80">
    <p class="text-sm tracking-tight text-muted-foreground">{t('selectTimePeriod')}</p>
    <VisualizationPeriodSelectSlider {period} {min} {max} {mode} {onPeriodChange} />
  </Popover.Content>
</Popover.Root>

<Drawer.Root>
  <Drawer.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" class="flex md:hidden h-12 w-36">
        <IconTimeline class="w-5 h-5 mr-3" stroke={1.75} />
        <div class="text-left">
          <p class="text-xs text-muted-foreground">{t('timePeriod')}</p>
          <p class="inline-flex gap-2 items-center">
            {label}
          </p>
        </div>
      </Button>
    {/snippet}
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>{t('timePeriod')}</Drawer.Title>
      <Drawer.Description>{t('timePeriodSelect')}</Drawer.Description>
    </Drawer.Header>
    <div class="px-6 py-2">
      <VisualizationPeriodSelectSlider {period} {min} {max} {mode} {onPeriodChange} />
    </div>
    <Drawer.Footer>
      <Drawer.Close class={buttonVariants({ variant: 'default' })}>
        {t('seeChanges')}
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
