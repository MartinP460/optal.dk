<script lang="ts">
  import { IconChevronRight } from '@tabler/icons-svelte'
  import type { KOTDataset } from 'parser'
  import Linechart from '$lib/components/Linechart.svelte'
  import Table from '$lib/components/Table.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Label } from '$lib/components/ui/label'
  import * as Popover from '$lib/components/ui/popover'
  import * as Select from '$lib/components/ui/select'
  import VisualizationSidebar from '$lib/components/VisualizationSidebar.svelte'
  import Barchart from '$lib/components/Barchart.svelte'
  import { t } from '$lib/i18n'

  export let dataGroups: KOTDataset[][]

  const has5OrMoreYearsOfData = dataGroups[0][0].years.length > 4

  let displayType: { value: 'chart' | 'table'; label: string }
  $: displayType = has5OrMoreYearsOfData
    ? { value: 'chart', label: $t('chart') }
    : { value: 'table', label: $t('table') }

  let selected: KOTDataset[]
  $: selected = dataGroups[0]
  $: selectedLabel = selected[0].categories.category

  const handleSelect = (dataset: KOTDataset) => {
    // if de-selecting
    if (selected.some(({ id }) => id === dataset.id)) {
      selected = selected.filter(({ id }) => id !== dataset.id)
      return
    }

    // if selecting multiple
    if (
      selectedLabel === dataset.categories.category &&
      !selected.map(({ id }) => id).includes(dataset.id)
    ) {
      selected = [...selected, dataset]
      return
    }

    if (displayType.value === 'chart') {
      selected = [dataset]
    } else {
      selected = [...selected, dataset]
    }
  }

  const handleDisplayTypeSelect = (value: unknown) => {
    // the library has bad typing ):
    const newValue = value as { value: 'chart' | 'table'; label: string }

    if (newValue.value === displayType.value) {
      return
    }

    displayType = newValue

    if (newValue.value === 'chart') {
      selected = dataGroups[0]
    }
  }
</script>

<div class="mt-8 sm:mt-12">
  <VisualizationSidebar
    {dataGroups}
    {selected}
    displayType={displayType.value}
    hideDisplayTypeButton={!has5OrMoreYearsOfData}
    on:filterChange={(e) => handleSelect(e.detail)}
    on:displayTypeChange={(e) => handleDisplayTypeSelect(e.detail)}
  />
  <div class="hidden sm:flex justify-between">
    <div class="flex gap-4">
      {#each dataGroups as dataGroup}
        <Popover.Root>
          <Popover.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="outline"
              class={selected
                .map(({ categories }) => categories.category)
                .includes(dataGroup[0].categories.category)
                ? 'bg-accent'
                : 'bg-transparent'}
              >{$t(dataGroup[0].categories.category)}
              <IconChevronRight
                size={16}
                class="ml-1 transition-transform {builder['data-state'] === 'open'
                  ? 'rotate-90'
                  : ''}"
              />
            </Button>
          </Popover.Trigger>
          <Popover.Content class="flex flex-col gap-2 w-fit"
            >{#each dataGroup as dataset (dataset.id)}
              <div class="flex items-center space-x-2">
                <Checkbox
                  id={String(dataset.id)}
                  aria-labelledby={dataset.categories.subcategory}
                  disabled={selected.length === 1 && selected[0].id === dataset.id}
                  checked={selected.map(({ id }) => id).includes(dataset.id)}
                  on:click={() => handleSelect(dataset)}
                />
                <Label
                  id={String(dataset.id)}
                  for={String(dataset.id)}
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {$t(dataset.categories.subcategory)}
                </Label>
              </div>
            {/each}
          </Popover.Content>
        </Popover.Root>
      {/each}
    </div>
    {#if has5OrMoreYearsOfData}
      <Select.Root selected={displayType} onSelectedChange={handleDisplayTypeSelect}>
        <Select.Trigger class="w-32">
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="chart">{$t('chart')}</Select.Item>
          <Select.Item value="table">{$t('table')}</Select.Item>
        </Select.Content>
      </Select.Root>
    {/if}
  </div>
  <div class="mt-6">
    {#if displayType.value === 'chart'}
      {#if selected[0].categories.category.includes('gender')}
        <Barchart datasets={selected} />
      {:else if has5OrMoreYearsOfData}
        <Linechart {selected} />
      {/if}
    {:else}
      <Table datasets={selected} />
    {/if}
  </div>
  <div class="flex justify-end mt-2">
    <p class="text-sm text-muted-foreground">
      {$t('source')}:
      <a
        href="https://ufm.dk/uddannelse/statistik-og-analyser/sogning-og-optag-pa-videregaende-uddannelser/grundtal-om-sogning-og-optag/kot-hovedtal"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:underline transition">KOT</a
      >
    </p>
  </div>
</div>
