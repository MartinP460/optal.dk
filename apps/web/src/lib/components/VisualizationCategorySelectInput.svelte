<script lang="ts">
  import { slide } from 'svelte/transition'
  import _ from 'lodash'
  import type {
    KOTCategory,
    KOTDataCategories,
    KOTDataCategory,
    KOTSubcategory
  } from '@optaldk/reader'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { Separator } from '$lib/components/ui/separator'
  import { chartConfig } from '$lib/utils/chartConfig'
  import {
    filterDatasetsBySubCategories,
    getCategories,
    getDefaultSubCategories,
    getSubCategories
  } from '$lib/utils/chartCategoryHelpers'
  import { Label } from '$lib/components/ui/label'
  import { t } from '$lib/i18n/index.svelte'
  import Button from '$lib/components/ui/button/button.svelte'

  type Props = {
    dataCategories: KOTDataCategories
    selectedDataCategory: KOTDataCategory
    onCategorySelect: (value: KOTDataCategory) => void
  }

  let { dataCategories, selectedDataCategory, onCategorySelect }: Props = $props()

  let isSubCategoriesExpanded = $state(false)

  let selectedSubCategories = $derived(getSubCategories(selectedDataCategory))

  let isSelectedCategory = $derived((category: KOTCategory) => {
    const subCategories = getSubCategories(dataCategories[category])

    return selectedSubCategories.some((subCategory) => subCategories.includes(subCategory))
  })

  let isSelectedSubCategoryGroup = $derived((groupSubCategories: KOTSubcategory[]) => {
    return selectedSubCategories.some((subCategory) => groupSubCategories.includes(subCategory))
  })

  const handleCategorySelect = (category: KOTCategory) => {
    const filteredDataCategory = getDefaultSubCategories(dataCategories[category]!)

    onCategorySelect(filteredDataCategory)

    isSubCategoriesExpanded = false
  }

  const handleSubCategoryGroupSelect = (category: KOTCategory, subCategories: KOTSubcategory[]) => {
    const subCategoriesWithYear = [...subCategories, 'year']

    const filteredDataset = dataCategories[category]?.datasets.map((datapoint) =>
      _.pickBy(datapoint, (_, key) => subCategoriesWithYear.includes(key as KOTSubcategory))
    ) as KOTDataCategory['datasets']

    // @ts-expect-error The filtered dataset is a type of dataset, but not all.
    onCategorySelect({
      ...selectedDataCategory,
      datasets: filteredDataset
    })

    isSubCategoriesExpanded = false
  }

  const handleSubCategorySelect = (category: KOTCategory, subCategory: KOTSubcategory) => {
    const groups = chartConfig[category].subCategories.groups

    let subCategories: KOTSubcategory[]
    if (groups) {
      subCategories =
        groups.find((group) => group.subCategories.includes(subCategory))?.subCategories ?? []
    } else {
      subCategories = getSubCategories(dataCategories[category])
    }

    const isSelected = !selectedSubCategories.includes(subCategory)

    const newSelectedSubCategories = subCategories.filter((prevSubCategory) =>
      prevSubCategory !== subCategory ? selectedSubCategories.includes(prevSubCategory) : isSelected
    )

    const filteredDataset = filterDatasetsBySubCategories(
      dataCategories[category]!,
      newSelectedSubCategories
    )

    onCategorySelect(filteredDataset)
  }
</script>

<div>
  {#each getCategories(dataCategories) as category (category)}
    <div class="{isSelectedCategory(category) ? 'pb-2 md:pb-0.5' : ''} py-3 md:py-1">
      <div class="flex items-center space-x-2">
        <Checkbox
          id={category}
          aria-labelledby={t(category)}
          checked={isSelectedCategory(category)}
          disabled={isSelectedCategory(category)}
          class="hover:bg-muted"
          onclick={() => handleCategorySelect(category)}
        />
        <Label
          id={category}
          for={category}
          class="text-base md:text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-all md:py-1 w-full"
        >
          {t(category)}
        </Label>
      </div>
      {#if isSelectedCategory(category)}
        <div class="ml-3 pt-2 md:pt-1" transition:slide>
          {#if chartConfig[category].subCategories.groups}
            {#each chartConfig[category].subCategories.groups as group (group.label)}
              <div class="flex items-center space-x-2">
                <!-- There's an issue with Checkbox that means we have to force it to re-render. -->
                {#key selectedDataCategory}
                  <Checkbox
                    id={group.label}
                    aria-labelledby={t(group.label)}
                    class="hover:bg-muted"
                    disabled={isSelectedSubCategoryGroup(group.subCategories)}
                    checked={isSelectedSubCategoryGroup(group.subCategories)}
                    onclick={() => handleSubCategoryGroupSelect(category, group.subCategories)}
                  />
                  <Label
                    id={group.label}
                    for={group.label}
                    class="text-base md:text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1.5 w-full"
                  >
                    {t(group.label)}
                  </Label>
                {/key}
              </div>
              {#if isSelectedSubCategoryGroup(group.subCategories)}
                <div class="ml-3 max-h-96 sm:max-h-fit overflow-y-scroll" transition:slide>
                  {#each isSubCategoriesExpanded || !group.collapsedSubCategories ? group.subCategories : group.collapsedSubCategories as subCategory (subCategory)}
                    <div class="flex items-center space-x-2">
                      {#key selectedDataCategory}
                        <Checkbox
                          id={subCategory}
                          aria-labelledby={t(category)}
                          disabled={selectedSubCategories.length === 1 &&
                            selectedSubCategories.includes(subCategory)}
                          checked={selectedSubCategories.includes(subCategory)}
                          class="hover:bg-muted"
                          onclick={() => handleSubCategorySelect(category, subCategory)}
                        />
                        <Label
                          id={subCategory}
                          for={subCategory}
                          class="text-base md:text-sm leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1.5 md:py-1 w-full"
                        >
                          {t(subCategory)}
                        </Label>
                      {/key}
                    </div>
                  {/each}
                  {#if group.collapsedSubCategories}
                    <Button
                      variant="link"
                      class="text-muted-foreground text-base sm:text-sm p-0 my-0 h-fit"
                      onclick={() => (isSubCategoriesExpanded = !isSubCategoriesExpanded)}
                      >{isSubCategoriesExpanded
                        ? t('showFewer')
                        : t('showXMore', {
                            number: group.subCategories.length - group.collapsedSubCategories.length
                          })}
                    </Button>
                  {/if}
                </div>
              {/if}
            {/each}
          {:else}
            <div>
              {#each getSubCategories(dataCategories[category]) as subCategory (subCategory)}
                <div class="flex items-center space-x-2">
                  {#key selectedDataCategory}
                    <Checkbox
                      id={subCategory}
                      aria-labelledby={t(subCategory)}
                      disabled={selectedSubCategories.length === 1 &&
                        selectedSubCategories.includes(subCategory)}
                      checked={selectedSubCategories.includes(subCategory)}
                      class="hover:bg-muted"
                      onclick={() => handleSubCategorySelect(category, subCategory)}
                    />
                    <Label
                      id={subCategory}
                      for={subCategory}
                      class="text-base md:text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-2 md:py-1.5 w-full"
                    >
                      {t(subCategory)}
                    </Label>
                  {/key}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
    <Separator class="md:hidden" />
  {/each}
</div>
