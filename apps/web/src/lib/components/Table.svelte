<script lang="ts">
  import type { KOTDataset } from 'parser'
  import * as Table from '$lib/components/ui/table'
  import { t } from '$lib/i18n'

  export let datasets: KOTDataset[]

  $: sortedDatasets = datasets.sort((a, b) => a.id - b.id)
</script>

<Table.Root class="text-xs mt-6 md:w-full">
  <Table.Header>
    <Table.Row>
      <Table.Head />
      {#each sortedDatasets as { id, categories: { category, subcategory, subsubcategory } } (id)}
        <Table.Head class="text-left pr-8 pt-2 lg:pr-4">
          <p class="text-muted-foreground">
            {subsubcategory
              ? `${$t(category)} - ${$t(subcategory).toLocaleLowerCase()}`
              : $t(category)}
          </p>
          <p class="text-sm text-primary">
            {$t(subsubcategory ?? subcategory)}
          </p>
        </Table.Head>
      {/each}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each [...sortedDatasets[0].years].reverse() as label, index}
      <Table.Row>
        <Table.Head>{label}</Table.Head>
        {#each datasets as dataset (dataset.id)}
          <Table.Cell class="font-medium">{[...dataset.data].reverse()[index]}</Table.Cell>
        {/each}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
