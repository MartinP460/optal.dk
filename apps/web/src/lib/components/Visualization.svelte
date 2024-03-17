<script lang="ts">
  import { IconChevronRight } from '@tabler/icons-svelte'
  import type { TooltipItem } from 'chart.js'
  import type { KOTDataset } from 'parser'
  import Linechart from '$lib/components/Linechart.svelte'
  import Table from '$lib/components/Table.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Label } from '$lib/components/ui/label'
  import * as Popover from '$lib/components/ui/popover'
  import * as Select from '$lib/components/ui/select'
  import VisualizationSidebar from '$lib/components/VisualizationSidebar.svelte'
  import { t } from '$lib/i18n'

  export let data: {
    labels: number[]
    datasets: KOTDataset[]
  }
  export let labelGroups: Omit<KOTDataset, 'data'>[][]

  const has5OrMoreYearsOfData = data.labels.length > 4

  let displayType: { value: 'chart' | 'table'; label: string }
  $: displayType = has5OrMoreYearsOfData
    ? { value: 'chart', label: $t('chart') }
    : { value: 'table', label: $t('table') }
  let selected: number[] = [labelGroups[0][0].id]
  let selectedLabel = labelGroups[0][0].label

  const handleSelect = (group: Omit<KOTDataset, 'data'>) => {
    // if de-selecting
    if (selectedLabel === group.label && selected.length == 2) {
      selected = selected.filter((id) => id !== group.id)
      return
    }

    // if selecting multiple
    if (selectedLabel === group.label && !selected.includes(group.id)) {
      selected = [...selected, group.id]
      return
    }

    selected = [group.id]
    selectedLabel = group.label
  }

  const handleDisplayTypeSelect = (value: unknown) => {
    // the library has bad typing ):
    const newValue = value as { value: 'chart' | 'table'; label: string }

    displayType = newValue
  }

  const tooltip = (item: TooltipItem<'line'> & { dataset: KOTDataset }) => {
    const dataset = data.datasets.find((dataset) => dataset.id === item.dataset.id)

    if (!dataset) return ''

    const { data: datasetData, category, unit } = dataset

    const dataPoint = datasetData[item.dataIndex] ?? $t('unknown')

    return ` ${$t(category)} - ${
      dataPoint !== '' ? dataPoint.toLocaleString() : $t('unapplicale')
    } ${unit ? $t(unit) : ''}`
  }

  $: maxY = data.datasets.find((dataset) => selected.includes(dataset.id))?.max
</script>

<div class="mt-8 sm:mt-12">
  {#if has5OrMoreYearsOfData}
    <VisualizationSidebar
      {labelGroups}
      {selected}
      {selectedLabel}
      displayType={displayType.value}
      on:filterChange={(e) => handleSelect(e.detail)}
      on:displayTypeChange={(e) => handleDisplayTypeSelect(e.detail)}
    />
  {/if}
  <div
    class={`hidden sm:flex ${displayType.value === 'chart' ? 'justify-between' : 'justify-end'}`}
  >
    {#if displayType.value === 'chart'}
      <div class="flex gap-4">
        {#each labelGroups as labelGroup}
          <Popover.Root>
            <Popover.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="outline"
                class={selectedLabel === labelGroup[0].label ? 'bg-gray-50' : 'bg-transparent'}
                >{$t(labelGroup[0].label)}
                <IconChevronRight
                  size={16}
                  class="ml-1 transition-transform {builder['data-state'] === 'open'
                    ? 'rotate-90'
                    : ''}"
                />
              </Button>
            </Popover.Trigger>
            <Popover.Content class="flex flex-col gap-2 w-fit"
              >{#each labelGroup as group (group.id)}
                <div class="flex items-center space-x-2">
                  <Checkbox
                    id={String(group.id)}
                    aria-labelledby={group.category}
                    disabled={selected.length === 1 && selected[0] === group.id}
                    checked={selected.includes(group.id)}
                    on:click={() => handleSelect(group)}
                  />
                  <Label
                    id={String(group.id)}
                    for={String(group.id)}
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {$t(group.category)}
                  </Label>
                </div>
              {/each}
            </Popover.Content>
          </Popover.Root>
        {/each}
      </div>
    {/if}
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
  {#if displayType.value === 'chart' && has5OrMoreYearsOfData}
    <Linechart {data} {selected} {maxY} {tooltip} />
  {:else}
    <Table {data} />
  {/if}
  <div class="flex justify-end mt-2">
    <p class="text-sm text-gray-500">
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
