<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import * as Sheet from '$lib/components/ui/sheet'
  import * as Accordion from '$lib/components/ui/accordion'
  import * as RadioGroup from '$lib/components/ui/radio-group'
  import Button from '$lib/components/ui/button/button.svelte'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Label } from '$lib/components/ui/label'
  import { IconAdjustmentsHorizontal, IconEye } from '@tabler/icons-svelte'
  import { t } from '$lib/i18n'
  import type { KOTDataset, KOTLabel } from '$lib/types/KOT'
  import { getLabelColorFromLabel } from '$lib/utils/getLineColorFromName'

  export let labelGroups: Omit<KOTDataset, 'data'>[][]
  export let displayType: 'chart' | 'table'
  export let selected: number[]
  export let selectedLabel: KOTLabel

  type DisplayType = {
    value: 'chart' | 'table'
    label: 'Chart' | 'Table'
  }

  const dispatch = createEventDispatcher<{
    filterChange: Omit<KOTDataset, 'data'>
    displayTypeChange: DisplayType
  }>()

  const handleDisplayTypeChange = (displayType: DisplayType) => {
    dispatch('displayTypeChange', displayType)
  }

  const handleFilterChange = (group: Omit<KOTDataset, 'data'>) => {
    dispatch('filterChange', group)
  }

  let triggerButton: 'category' | 'display' | undefined
</script>

<Sheet.Root>
  {#if displayType === 'chart'}
    <Sheet.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        class="sm:hidden py-6"
        on:click={() => (triggerButton = 'category')}
      >
        <IconAdjustmentsHorizontal class="text-gray-600 h-5 w-5 mr-2" />
        <span class="flex flex-col text-left">
          <p class="text-xs leading-none text-gray-600">{$t('category')}</p>
          <span class="flex"
            ><p class="leading-tight">{$t(selectedLabel)}</p>
            <span
              class="w-2 h-2 rounded-full ml-2 mt-1.5"
              style={`background-color: ${getLabelColorFromLabel(selectedLabel)};`}
            /></span
          >
        </span>
      </Button>
    </Sheet.Trigger>
  {/if}
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
          <Accordion.Trigger
            class="text-left text-sm sm:text-base gap-6 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:no-underline"
            disabled={displayType === 'table'}>{$t('category')}</Accordion.Trigger
          >
          <Accordion.Content>
            {#each labelGroups as labelGroup}
              <p class="text-foreground leading-none font-medium first:mt-2 mt-6 mb-4">
                {$t(labelGroup[0].label)}
              </p>
              <div class="flex flex-col gap-y-4">
                {#each labelGroup as group (group.id)}
                  <div class="flex items-center space-x-2 w-full">
                    <Label
                      for={String(group.id)}
                      class="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full font-normal"
                    >
                      {$t(group.category)}
                    </Label>
                    <Checkbox
                      id={String(group.id)}
                      aria-labelledby={group.category}
                      disabled={selected.length === 1 && selected[0] === group.id}
                      checked={selected.includes(group.id)}
                      class="w-5 h-5"
                      on:click={() => handleFilterChange(group)}
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
