<script lang="ts">
  import { IconAdjustmentsHorizontal, IconEye } from '@tabler/icons-svelte'
  import { createEventDispatcher } from 'svelte'
  import clsx from 'clsx'
  import type { KOTDataset } from 'parser'

  import * as Accordion from '$lib/components/ui/accordion'
  import Button from '$lib/components/ui/button/button.svelte'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Label } from '$lib/components/ui/label'
  import * as RadioGroup from '$lib/components/ui/radio-group'
  import * as Sheet from '$lib/components/ui/sheet'
  import { t } from '$lib/i18n'
  import { getLabelColorFromLabel } from '$lib/utils/getLineColorFromName'

  export let dataGroups: KOTDataset[][]
  export let displayType: 'chart' | 'table'
  export let selected: KOTDataset[]
  export let hideDisplayTypeButton: boolean = false

  const selectedLabel = selected[0].categories.category

  type DisplayType = {
    value: 'chart' | 'table'
    label: 'Chart' | 'Table'
  }

  const dispatch = createEventDispatcher<{
    filterChange: KOTDataset
    displayTypeChange: DisplayType
  }>()

  const handleDisplayTypeChange = (displayType: DisplayType) => {
    dispatch('displayTypeChange', displayType)
  }

  const handleFilterChange = (group: KOTDataset) => {
    dispatch('filterChange', group)
  }

  let triggerButton: 'category' | 'display' | undefined
</script>

<Sheet.Root>
  <Sheet.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      class="sm:hidden py-6"
      on:click={() => (triggerButton = 'category')}
    >
      <IconAdjustmentsHorizontal class="text-gray-600 h-5 w-5 mr-2" />
      <span class="flex flex-col text-left">
        <p class={clsx('leading-none text-gray-600', displayType === 'chart' && 'text-xs')}>
          {$t('category')}
        </p>
        {#if displayType === 'chart'}
          <span class="flex"
            ><p class="leading-tight">{$t(selectedLabel)}</p>
            <span
              class="w-2 h-2 rounded-full ml-2 mt-1.5"
              style={`background-color: ${getLabelColorFromLabel(selectedLabel)};`}
            /></span
          >
        {/if}
      </span>
    </Button>
  </Sheet.Trigger>
  {#if !hideDisplayTypeButton}
    <Sheet.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        class="sm:hidden py-6 ml-2"
        on:click={() => (triggerButton = 'display')}
      >
        <IconEye class="text-gray-600 h-5 w-5 mr-2" />
        {$t('display')}
      </Button>
    </Sheet.Trigger>
  {/if}
  <Sheet.Content class="flex flex-col">
    <Sheet.Header>
      <Sheet.Title class="mt-6 text-left">{$t('displaySettings')}</Sheet.Title>
      <Sheet.Description class="text-left sr-only">
        {$t('displaySettingsDescription')}
      </Sheet.Description>
    </Sheet.Header>
    <div class="mt-4">
      <Accordion.Root value={triggerButton}>
        <Accordion.Item value="display">
          <Accordion.Trigger class="text-left text-sm sm:text-base gap-6"
            >{$t('display')}</Accordion.Trigger
          >
          <Accordion.Content>
            <RadioGroup.Root value={displayType}>
              <div class="flex items-center py-2">
                <Label for="chart" class="w-full font-normal">{$t('chart')}</Label>
                <RadioGroup.Item
                  id="chart"
                  value="chart"
                  class="w-5 h-5"
                  on:click={() => handleDisplayTypeChange({ value: 'chart', label: 'Chart' })}
                  on:keydown={() => handleDisplayTypeChange({ value: 'chart', label: 'Chart' })}
                />
              </div>
              <div class="flex items-center py-1">
                <Label for="table" class="w-full font-normal">{$t('table')}</Label>
                <RadioGroup.Item
                  id="table"
                  value="table"
                  class="w-5 h-5"
                  on:click={() => handleDisplayTypeChange({ value: 'table', label: 'Table' })}
                  on:keydown={() => handleDisplayTypeChange({ value: 'table', label: 'Table' })}
                />
              </div>
            </RadioGroup.Root>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="category">
          <Accordion.Trigger class="text-left text-sm sm:text-base gap-6">
            {$t('category')}
          </Accordion.Trigger>
          <Accordion.Content>
            {#each dataGroups as dataGroup}
              <p class="text-foreground leading-none font-medium first:mt-2 mt-6 mb-4">
                {$t(dataGroup[0].categories.category)}
              </p>
              <div class="flex flex-col gap-y-4">
                {#each dataGroup as dataset (dataset.id)}
                  <div class="flex items-center space-x-2 w-full">
                    <Label
                      for={String(dataset.id)}
                      class="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full font-normal"
                    >
                      {$t(dataset.categories.subcategory)}
                    </Label>
                    <Checkbox
                      id={String(dataset.id)}
                      aria-labelledby={dataset.categories.subcategory}
                      disabled={selected.length === 1 && selected[0].id === dataset.id}
                      checked={selected.map(({ id }) => id).includes(dataset.id)}
                      class="w-5 h-5"
                      on:click={() => handleFilterChange(dataset)}
                    />
                  </div>
                {/each}
              </div>
            {/each}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
    <Sheet.Footer class="mt-auto">
      <Sheet.Close asChild let:builder>
        <Button builders={[builder]} type="submit">{$t('saveChanges')}</Button>
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
