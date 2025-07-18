<script lang="ts">
  import type { KOTDataCategory } from 'reader'
  import * as Table from '$lib/components/ui/table'
  import { getLegendLabels } from '$lib/utils/chartHelpers'
  import { getSubCategoryValues } from '$lib/utils/chartCategoryHelpers'
  import { t } from '$lib/i18n/index.svelte'
  import Source from '$lib/components/Source.svelte'

  type Props = {
    dataCategory: KOTDataCategory
  }

  let { dataCategory }: Props = $props()

  let { group, labels } = $derived(getLegendLabels(dataCategory))
  let datasets = $derived([...dataCategory.datasets].reverse())
</script>

<Table.Root class="text-xs md:w-full">
  <Table.Header>
    <Table.Row>
      <Table.Head class="text-sm">{group ? t(group) : ''}</Table.Head>
      {#each labels as label (label)}
        <Table.Head class="text-left pr-8 lg:pr-4">
          <p class="text-sm text-primary text-nowrap">
            {t(label)}
          </p>
        </Table.Head>
      {/each}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each datasets as dataset (dataset.year)}
      <Table.Row>
        <Table.Head>{dataset.year}</Table.Head>
        {#each getSubCategoryValues(dataset) as subCategory (subCategory)}
          <Table.Cell class="font-medium">{subCategory}</Table.Cell>
        {/each}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
<div class="flex justify-end mt-4">
  <Source />
</div>
