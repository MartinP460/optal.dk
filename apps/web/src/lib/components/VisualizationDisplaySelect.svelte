<script lang="ts">
  import { IconChartBar } from '@tabler/icons-svelte'
  import type { KOTDataCategory } from '@optaldk/reader'
  import type { DisplayType } from '$lib/utils/chartCategoryHelpers'
  import { getDisplayTypesFromDataCategory } from '$lib/utils/chartCategoryHelpers'
  import { Label } from '$lib/components/ui/label'
  import { Separator } from '$lib/components/ui/separator'
  import { t } from '$lib/i18n/index.svelte'
  import { Button, buttonVariants } from '$lib/components/ui/button'
  import * as Select from '$lib/components/ui/select'
  import * as Drawer from '$lib/components/ui/drawer'
  import * as RadioGroup from '$lib/components/ui/radio-group'

  type Props = {
    selectedDataCategory: KOTDataCategory
    selectedDisplayType: DisplayType
    onDisplayTypeSelect: (value: DisplayType) => void
  }

  let { selectedDataCategory, selectedDisplayType, onDisplayTypeSelect }: Props = $props()

  let displayTypes = $derived(getDisplayTypesFromDataCategory(selectedDataCategory.name))

  const handleDisplayTypeSelect = (value: string) => {
    onDisplayTypeSelect(value as DisplayType)
  }
</script>

<div class="gap-4 hidden md:flex md:ml-auto">
  <Select.Root type="single" value={selectedDisplayType} onValueChange={handleDisplayTypeSelect}>
    <Select.Trigger class="w-32 h-full">{t(selectedDisplayType)}</Select.Trigger>
    <Select.Content>
      {#each displayTypes as displayType (displayType)}
        <Select.Item value={displayType}>{t(displayType)}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>

<Drawer.Root>
  <Drawer.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" class="h-12 flex md:hidden">
        <IconChartBar class="w-5 h-5 mr-3" stroke={1.75} />
        <div class="text-left">
          <p class="text-xs text-muted-foreground">{t('display')}</p>
          <p class="inline-flex gap-2 items-center">
            {t(selectedDisplayType)}
          </p>
        </div>
      </Button>
    {/snippet}
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>{t('display')}</Drawer.Title>
      <Drawer.Description>{t('displaySelect')}</Drawer.Description>
    </Drawer.Header>
    <div class="px-6 py-2">
      <RadioGroup.Root value={selectedDisplayType} class="gap-0">
        {#each displayTypes as displayType (displayType)}
          <div class="flex items-center gap-x-3 py-3">
            <RadioGroup.Item
              id={t(displayType)}
              value={displayType}
              onclick={() => onDisplayTypeSelect(displayType)}
            />
            <Label for={t(displayType)} class="font-normal text-base w-full">{t(displayType)}</Label
            >
          </div>
          <Separator />
        {/each}
      </RadioGroup.Root>
    </div>
    <Drawer.Footer>
      <Drawer.Close class={buttonVariants({ variant: 'default' })}>
        {t('seeChanges')}
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
