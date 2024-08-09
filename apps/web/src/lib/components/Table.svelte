<script lang="ts">
  import type { KOTDataCategory } from 'parser'
  import * as Table from '$lib/components/ui/table'
  import { getChartProps } from '$lib/utils/chartHelpers'
  import { getSubCategoryValues } from '$lib/utils/chartCategoryHelpers'
  import { t } from '$lib/i18n'
  import Source from '$lib/components/Source.svelte'

  export let dataCategory: KOTDataCategory

  $: ({
    legendLabels: { group, labels }
  } = getChartProps(dataCategory))
</script>

<Table.Root class="text-xs md:w-full">
  <Table.Header>
    <Table.Row>
      <Table.Head class="text-sm">{group ? $t(group) : ''}</Table.Head>
      {#each labels as label (label)}
        <Table.Head class="text-left pr-8 pt-2 lg:pr-4">
          <p class="text-sm text-primary">
            {$t(label)}
          </p>
        </Table.Head>
      {/each}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each dataCategory.datasets.reverse() as dataset (dataset.year)}
      <Table.Row>
        <Table.Head>{dataset.year}</Table.Head>
        {#each getSubCategoryValues(dataset) as subCategory}
          <Table.Cell class="font-medium">{subCategory}</Table.Cell>
        {/each}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
<div class="flex justify-end mt-4">
  <Source />
</div>
