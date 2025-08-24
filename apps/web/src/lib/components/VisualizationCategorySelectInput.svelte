<script lang="ts">
  import { slide } from 'svelte/transition'
  import _ from 'lodash'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Separator } from '$lib/components/ui/separator'
  import { categories, CategoryLabel } from '$lib/utils/categories'
  import { Label } from '$lib/components/ui/label'
  import { t } from '$lib/i18n/index.svelte'
  import { getVisualizationState } from '$lib/utils/visualizationState.svelte'
  import VisualizationCategorySelectInputRec from './VisualizationCategorySelectInputRec.svelte'

  const {
    category: activeCategory,
    categoriesToDisplay,
    onCategoryChange
  } = $derived(getVisualizationState())

  let isSelectedCategory = $derived((category: CategoryLabel) => {
    return activeCategory.label === category
  })
</script>

<div>
  {#each Object.values(categories).filter( (category) => categoriesToDisplay.includes(category.label) ) as c (c.label)}
    <div class="{isSelectedCategory(c.label) ? 'pb-2 md:pb-0.5' : ''} py-3 md:py-1">
      <div class="flex items-center space-x-2">
        <Checkbox
          id={c.label}
          aria-labelledby={t(c.label)}
          checked={isSelectedCategory(c.label)}
          disabled={isSelectedCategory(c.label)}
          class="hover:bg-muted"
          onclick={() => onCategoryChange(c)}
        />
        <Label
          id={c.label}
          for={c.label}
          class="text-base md:text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all md:py-1 w-full"
        >
          {t(c.label)}
        </Label>
      </div>
      {#if isSelectedCategory(c.label)}
        <div class="pt-2 md:pt-1" transition:slide>
          <VisualizationCategorySelectInputRec
            activeSubcategories={activeCategory.subcategories}
            subcategories={c.subcategories}
            onSubcategorySelect={(subcategories) => onCategoryChange({ ...c, subcategories })}
          />
        </div>
      {/if}
    </div>
    <Separator class="md:hidden" />
  {/each}
</div>
