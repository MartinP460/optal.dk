<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import type { KOTDataset } from 'parser'

  import * as Accordion from '$lib/components/ui/accordion'
  import Button from '$lib/components/ui/button/button.svelte'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Label } from '$lib/components/ui/label'
  import * as RadioGroup from '$lib/components/ui/radio-group'
  import * as Sheet from '$lib/components/ui/sheet'
  import { t } from '$lib/i18n'

  export let dataGroups: KOTDataset[][]
  export let displayType: 'chart' | 'table'
  export let selectedDatagroup: KOTDataset[]
  export let triggeredSetting: 'category' | 'display' | undefined

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

  $: selectedTab =
    triggeredSetting === 'category' ? selectedDatagroup[0].categories.category : 'display'
</script>

<Sheet.Content class="flex flex-col">
  <Sheet.Header>
    <Sheet.Title class="mt-6 text-left">{$t('displaySettings')}</Sheet.Title>
    <Sheet.Description class="text-left sr-only">
      {$t('displaySettingsDescription')}
    </Sheet.Description>
  </Sheet.Header>
  <div class="mt-4">
    <Accordion.Root value={selectedTab}>
      {#if triggeredSetting === 'display'}
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
      {/if}
      {#if triggeredSetting === 'category'}
        {#each dataGroups as dataGroup}
          <Accordion.Item value={String(dataGroup[0].categories.category)}>
            <Accordion.Trigger class="text-left text-sm sm:text-base gap-6">
              {$t(dataGroup[0].categories.category)}
            </Accordion.Trigger>
            <Accordion.Content>
              <div class="flex flex-col">
                {#each dataGroup as dataset (dataset.id)}
                  <div class="flex items-center space-x-2 w-full">
                    <Label
                      for={String(dataset.id)}
                      class="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full font-normal py-3"
                    >
                      {$t(dataset.categories.subcategory)}
                    </Label>
                    <Checkbox
                      id={String(dataset.id)}
                      aria-labelledby={dataset.categories.subcategory}
                      disabled={selectedDatagroup.length === 1 &&
                        selectedDatagroup[0].id === dataset.id}
                      checked={selectedDatagroup.map(({ id }) => id).includes(dataset.id)}
                      class="w-5 h-5 hover:bg-muted"
                      on:click={() => handleFilterChange(dataset)}
                    />
                  </div>
                {/each}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        {/each}
      {/if}
    </Accordion.Root>
  </div>
  <Sheet.Footer class="mt-auto">
    <Sheet.Close asChild let:builder>
      <Button builders={[builder]} type="submit" class="w-full">{$t('seeChanges')}</Button>
    </Sheet.Close>
  </Sheet.Footer>
</Sheet.Content>
