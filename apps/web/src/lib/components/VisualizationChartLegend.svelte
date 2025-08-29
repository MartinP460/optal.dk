<script lang="ts">
  import { t } from '$lib/i18n/index.svelte'
  import { getColorFromSubcategory } from '$lib/utils/getColorFromDataset'
  import VisualizationSource from '$lib/components/VisualizationSource.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import { getLegendLabels } from '$lib/utils/visualizationChart.svelte'

  const { topLabel, subcategories, collapsedSubcategories } = $derived(getLegendLabels())

  let isLabelsExpanded = $state(false)
</script>

<div class="flex flex-col sm:flex-row-reverse justify-between mt-4 sm:gap-8 sm:items-center">
  <VisualizationSource class="self-end sm:self-start" />
  <div>
    {#if topLabel}
      <p class="text-muted-foreground text-sm">({t(topLabel)})</p>
    {/if}
    <div class="flex flex-wrap gap-x-5 gap-y-2 mt-2">
      {#each !isLabelsExpanded && collapsedSubcategories ? collapsedSubcategories : subcategories as label (label)}
        <span class="flex items-center gap-2 text-sm text-muted-foreground">
          <div
            class="w-3 h-3 rounded shrink-0"
            style={`background-color: ${getColorFromSubcategory(label)}`}
          ></div>
          {t(label)}
        </span>
      {/each}
      {#if collapsedSubcategories}
        <Button
          variant="link"
          class="text-muted-foreground text-sm p-0 my-0 h-fit"
          onclick={() => (isLabelsExpanded = !isLabelsExpanded)}
          >{isLabelsExpanded
            ? t('showFewer')
            : t('showXMore', {
                number: subcategories.length - collapsedSubcategories.length
              })}
        </Button>
      {/if}
    </div>
  </div>
</div>
