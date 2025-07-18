<script lang="ts">
  import type { KOTDataCategory } from '@optaldk/reader'
  import type { DisplayType } from '$lib/utils/chartCategoryHelpers'
  import { getLegendLabels } from '$lib/utils/chartHelpers'
  import ChartLegend from '$lib/components/ChartLegend.svelte'
  import ChartSingle from '$lib/components/ChartSingle.svelte'
  import ChartXY from '$lib/components/ChartXY.svelte'

  type Props = {
    dataCategory: KOTDataCategory
    displayType: DisplayType
    period: number[]
  }

  let { dataCategory, displayType, period }: Props = $props()

  let legendLabels = $derived(getLegendLabels(dataCategory))
</script>

<figure>
  {#if displayType === 'donutchart'}
    <ChartSingle {dataCategory} {period} />
  {:else}
    <ChartXY {dataCategory} {displayType} />
  {/if}
  <ChartLegend
    group={legendLabels.group}
    labels={legendLabels.labels}
    collapsedLabels={legendLabels.collapsedLabels}
  />
</figure>
