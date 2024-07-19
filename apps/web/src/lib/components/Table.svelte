<script lang="ts">
  import type { KOTDataCategory } from 'parser'
  import * as Table from '$lib/components/ui/table'
  import { getChartProps } from '$lib/utils/chartHelpers'
  import { getSubCategoryValues } from '$lib/utils/chartCategoryHelpers'
  import { t } from '$lib/i18n'

  export let dataCategory: KOTDataCategory

  $: ({ legendLabels } = getChartProps(dataCategory))
</script>

<Table.Root class="text-xs md:w-full">
  <Table.Header>
    <Table.Row>
      <Table.Head />
      {#each legendLabels as { group, label } (label)}
        <Table.Head class="text-left pr-8 pt-2 lg:pr-4">
          <p class="text-muted-foreground">
            {group ? `${$t(dataCategory.name)} - ${$t(group)}` : $t(dataCategory.name)}
          </p>
          <p class="text-sm text-primary">
            {$t(label)}
          </p>
        </Table.Head>
      {/each}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each dataCategory.datasets.reverse() as dataset}
      <Table.Row>
        <Table.Head>{dataset.year}</Table.Head>
        {#each getSubCategoryValues(dataset) as subCategory (subCategory)}
          <Table.Cell class="font-medium">{subCategory}</Table.Cell>
        {/each}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
