<script lang="ts">
  import { IconAdjustmentsHorizontal, IconChevronRight, IconEye } from '@tabler/icons-svelte'
  import clsx from 'clsx'
  import type { KOTDataset } from 'parser'
  import Linechart from '$lib/components/Linechart.svelte'
  import Table from '$lib/components/Table.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Label } from '$lib/components/ui/label'
  import * as Popover from '$lib/components/ui/popover'
  import * as Select from '$lib/components/ui/select'
  import * as Sheet from '$lib/components/ui/sheet'
  import VisualizationSidebar from '$lib/components/VisualizationSidebar.svelte'
  import Barchart from '$lib/components/Barchart.svelte'
  import { t } from '$lib/i18n'
  import { getLabelColorFromLabel } from '$lib/utils/getColorFromDataset'

  export let dataGroups: KOTDataset[][]

  const MAX_DATAGROUP_BUTTONS = 3

  const has5OrMoreYearsOfData = dataGroups[0][0].years.length > 4

  let triggeredSetting: 'category' | 'display' | undefined

  let displayType: { value: 'chart' | 'table'; label: string }
  $: displayType = has5OrMoreYearsOfData
    ? { value: 'chart', label: $t('chart') }
    : { value: 'table', label: $t('table') }

  let selectedDatagroup: KOTDataset[]
  $: selectedDatagroup = dataGroups[0]
  $: selectedLabel = selectedDatagroup[0].categories.category

  // i'm really, really sorry that you have to witness to this eyesore
  const handleCategorySelect = (dataset: KOTDataset) => {
    // if a datagroup consists of datasets that need to be displayed simultaneously
    if (dataset.categories.subsubcategory) {
      const originalDataGroup =
        dataGroups.find(
          (datagroup) => datagroup[0].categories.category === dataset.categories.category
        ) ?? []

      const selectedDatasets = originalDataGroup.filter(
        ({ categories }) => categories.subcategory === dataset.categories.subcategory
      )

      if (displayType.value === 'chart') {
        selectedDatagroup = selectedDatasets
      } else {
        const datagroupExists = selectedDatagroup.some(
          ({ categories }) => categories.subcategory === dataset.categories.subcategory
        )

        if (datagroupExists) {
          selectedDatagroup = selectedDatagroup.filter(
            ({ categories }) => categories.subcategory !== dataset.categories.subcategory
          )
        } else {
          selectedDatagroup = [...selectedDatagroup, ...selectedDatasets]
        }
      }

      return
    }

    // if de-selecting
    if (selectedDatagroup.some(({ id }) => id === dataset.id)) {
      selectedDatagroup = selectedDatagroup.filter(({ id }) => id !== dataset.id)
      return
    }

    // if selecting multiple
    if (
      selectedLabel === dataset.categories.category &&
      !selectedDatagroup.map(({ id }) => id).includes(dataset.id)
    ) {
      selectedDatagroup = [...selectedDatagroup, dataset]
      return
    }

    if (displayType.value === 'chart') {
      selectedDatagroup = [dataset]
    } else {
      selectedDatagroup = [...selectedDatagroup, dataset]
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
      selectedDatagroup = dataGroups[0]
    }
  }
</script>

<div class="mt-8 sm:mt-12">
  <Sheet.Root>
    <VisualizationSidebar
      {dataGroups}
      {selectedDatagroup}
      {triggeredSetting}
      displayType={displayType.value}
      on:filterChange={(e) => handleCategorySelect(e.detail)}
      on:displayTypeChange={(e) => handleDisplayTypeSelect(e.detail)}
    />
    <Sheet.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        class="md:hidden py-6"
        on:click={() => (triggeredSetting = 'category')}
      >
        <IconAdjustmentsHorizontal class="text-muted-foreground h-5 w-5 mr-2" />
        <span class="flex flex-col text-left">
          <p
            class={clsx(
              'leading-none text-muted-foreground',
              displayType.value === 'chart' && 'text-xs'
            )}
          >
            {$t('category')}
          </p>
          {#if displayType.value === 'chart'}
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
    {#if has5OrMoreYearsOfData}
      <Sheet.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="outline"
          class="md:hidden py-6 ml-2"
          on:click={() => (triggeredSetting = 'display')}
        >
          <IconEye class="text-gray-600 h-5 w-5 mr-2" />
          {$t('display')}
        </Button>
      </Sheet.Trigger>
    {/if}
    <div class="hidden md:flex justify-between">
      <div class="flex gap-4">
        {#each dataGroups.slice(0, MAX_DATAGROUP_BUTTONS) as dataGroup}
          <Popover.Root>
            <Popover.Trigger asChild let:builder>
              <Button
                builders={[builder]}
                variant="outline"
                class={selectedDatagroup
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
            <Popover.Content class="flex flex-col w-fit py-2">
              {#each dataGroup as dataset (dataset.id)}
                <div class="flex items-center space-x-2">
                  <Checkbox
                    id={String(dataset.id)}
                    aria-labelledby={dataset.categories.subcategory}
                    disabled={selectedDatagroup.length === 1 &&
                      selectedDatagroup[0].id === dataset.id}
                    checked={selectedDatagroup.map(({ id }) => id).includes(dataset.id)}
                    class="hover:bg-muted"
                    on:click={() => handleCategorySelect(dataset)}
                  />
                  <Label
                    id={String(dataset.id)}
                    for={String(dataset.id)}
                    class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-2 w-full"
                  >
                    {$t(dataset.categories.subcategory)}
                  </Label>
                </div>
              {/each}
            </Popover.Content>
          </Popover.Root>
        {/each}
        {#if dataGroups.length > MAX_DATAGROUP_BUTTONS}
          <Sheet.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="outline"
              on:click={() => (triggeredSetting = 'category')}
            >
              {$t('allCategories')}
              <IconAdjustmentsHorizontal size={16} class="ml-2" />
            </Button>
          </Sheet.Trigger>
        {/if}
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
  </Sheet.Root>
  <div class="mt-6">
    {#if displayType.value === 'chart'}
      {#if selectedDatagroup[0].categories.category === 'gender'}
        <Barchart datasets={selectedDatagroup} />
      {:else if has5OrMoreYearsOfData}
        <Linechart datasets={selectedDatagroup} />
      {/if}
    {:else}
      <Table datasets={selectedDatagroup} />
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
