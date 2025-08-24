<script lang="ts">
  import { slide } from 'svelte/transition'
  import type { SubCategory, SubCategoryLabel } from '$lib/utils/categories'
  import type { NewKOTDataPointKeys } from '@optaldk/reader'
  import { Button } from './ui/button'
  import VisualizationCategorySelectInputRec from './VisualizationCategorySelectInputRec.svelte'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Label } from '$lib/components/ui/label'
  import { t } from '$lib/i18n/index.svelte'

  type Props = {
    activeSubcategories: (SubCategory | NewKOTDataPointKeys)[]
    subcategories: (SubCategory | NewKOTDataPointKeys)[]
    collapsedSubcategories?: (SubCategory | NewKOTDataPointKeys)[]
    onSubcategorySelect: (subcategory: (SubCategory | NewKOTDataPointKeys)[]) => void
  }

  const { activeSubcategories, subcategories, collapsedSubcategories, onSubcategorySelect }: Props =
    $props()

  let isSubcategoriesExpanded = $state(false)

  const isActiveSubcategory = (subcategory: SubCategoryLabel | NewKOTDataPointKeys) => {
    if (
      activeSubcategories.length > 0 &&
      typeof activeSubcategories[0] === 'string' &&
      typeof subcategory === 'string'
    ) {
      return activeSubcategories.includes(subcategory as NewKOTDataPointKeys)
    } else {
      return (activeSubcategories as SubCategory[]).some(
        (activeSubcategory) => activeSubcategory.label === subcategory
      )
    }
  }

  const handleSubcategorySelect = (subcategory: SubCategory | NewKOTDataPointKeys) => {
    const label = typeof subcategory === 'string' ? subcategory : subcategory.label
    const isActive = isActiveSubcategory(label)

    if (isActive) {
      const filteredCategories = activeSubcategories.filter((activeSubcategory) =>
        typeof activeSubcategory === 'string'
          ? activeSubcategory !== label
          : activeSubcategory.label !== label
      )
      onSubcategorySelect(filteredCategories)
    } else {
      onSubcategorySelect(
        typeof subcategory === 'string' ? [...activeSubcategories, subcategory] : [subcategory]
      )
    }
  }
</script>

<div class="ml-3 max-h-96 sm:max-h-fit overflow-y-auto">
  {#each isSubcategoriesExpanded || !collapsedSubcategories ? subcategories : collapsedSubcategories as sc (sc)}
    <div class="flex items-center space-x-2">
      <!-- There's an issue with Checkbox that means we have to force it to re-render. -->
      {#key activeSubcategories}
        {#if typeof sc === 'string'}
          <Checkbox
            id={sc}
            aria-labelledby={t(sc)}
            disabled={activeSubcategories.length === 1 && isActiveSubcategory(sc)}
            checked={isActiveSubcategory(sc)}
            class="hover:bg-muted"
            onclick={() => handleSubcategorySelect(sc)}
          />
          <Label
            id={sc}
            for={sc}
            class="text-base md:text-sm leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1.5 md:py-1 w-full"
          >
            {t(sc)}
          </Label>
        {:else}
          <Checkbox
            id={sc.label}
            aria-labelledby={t(sc.label)}
            disabled={activeSubcategories.length === 1 && isActiveSubcategory(sc.label)}
            checked={isActiveSubcategory(sc.label)}
            class="hover:bg-muted"
            onclick={() => handleSubcategorySelect(sc)}
          />
          <Label
            id={sc.label}
            for={sc.label}
            class="text-base md:text-sm leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1.5 md:py-1 w-full"
          >
            {t(sc.label)}
          </Label>
        {/if}
      {/key}
    </div>
    {#if typeof sc === 'object' && isActiveSubcategory(sc.label)}
      <div transition:slide>
        <VisualizationCategorySelectInputRec
          activeSubcategories={isActiveSubcategory(sc.label)
            ? ((activeSubcategories as SubCategory[]).find(
                (subcategory) => subcategory.label === sc.label
              )?.subcategories ?? [])
            : []}
          subcategories={sc.subcategories}
          collapsedSubcategories={sc.collapsedSubCategories}
          onSubcategorySelect={(subcategories) => onSubcategorySelect([{ ...sc, subcategories }])}
        />
      </div>
    {/if}
  {/each}
  {#if collapsedSubcategories}
    <Button
      variant="link"
      class="text-muted-foreground text-base sm:text-sm p-0 my-0 h-fit"
      onclick={() => (isSubcategoriesExpanded = !isSubcategoriesExpanded)}
      >{isSubcategoriesExpanded
        ? t('showFewer')
        : t('showXMore', {
            number: subcategories.length - collapsedSubcategories.length
          })}
    </Button>
  {/if}
</div>
