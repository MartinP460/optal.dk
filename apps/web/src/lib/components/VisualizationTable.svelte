<script lang="ts">
  import _ from 'lodash'
  import * as Table from '$lib/components/ui/table'
  import { t } from '$lib/i18n/index.svelte'
  import VisualizationSource from '$lib/components/VisualizationSource.svelte'
  import {
    getLegendLabels,
    getVisualizationChartXYProps
  } from '$lib/utils/visualizationChart.svelte'

  const { data } = $derived(getVisualizationChartXYProps())
  const { topLabel, subcategories } = $derived(getLegendLabels())
</script>

<Table.Root class="text-xs md:w-full">
  <Table.Header>
    <Table.Row>
      <Table.Head class="text-sm">{topLabel ? t(topLabel) : ''}</Table.Head>
      {#each subcategories as subcategory (subcategory)}
        <Table.Head class="text-left pr-8 lg:pr-4">
          <p class="text-sm text-primary text-nowrap">
            {t(subcategory)}
          </p>
        </Table.Head>
      {/each}
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each [...data].reverse() as datapoint (datapoint.year)}
      <Table.Row>
        <Table.Head>{datapoint.year}</Table.Head>
        {#each Object.values(_.omit(datapoint, 'year')) as value, i (i)}
          <Table.Cell class="font-medium">{value}</Table.Cell>
        {/each}
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
<div class="flex justify-end mt-4">
  <VisualizationSource />
</div>
