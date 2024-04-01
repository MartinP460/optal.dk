<script lang="ts">
  import type { KOTDataset } from 'parser'
  import * as Table from '$lib/components/ui/table'
  import { t } from '$lib/i18n'

  export let data: {
    labels: number[]
    datasets: KOTDataset[]
  }
</script>

<Table.Root class="text-xs mt-6 md:w-full w-[768px]">
  <Table.Header>
    <Table.Row>
      <Table.Head />
      {#each data.datasets as dataset (dataset.id)}
        <Table.Head class="text-left pr-8 pt-2 lg:pr-4">
          <p class="text-gray-400">{$t(dataset.category)}</p>
          <p class="text-sm text-gray-600">{$t(dataset.subcategory)}</p>
        </Table.Head>
      {/each}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each [...data.labels].reverse() as label, index}
      <Table.Row>
        <Table.Head>{label}</Table.Head>
        {#each data.datasets as dataset (dataset.id)}
          <Table.Cell class="font-medium">{[...dataset.data].reverse()[index]}</Table.Cell>
        {/each}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
