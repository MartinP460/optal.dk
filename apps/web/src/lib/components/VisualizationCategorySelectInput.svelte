<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { slide } from 'svelte/transition'
  import _ from 'lodash'
  import type {
    NewKOTCategory,
    NewKOTDataCategories,
    NewKOTDataCategory,
    NewKOTSubcategory
  } from '$lib/utils/transformInstitutionsToNewFormat'
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
  import { t } from '$lib/i18n'

  export let dataCategories: NewKOTDataCategories
  export let selectedDataCategory: NewKOTDataCategory

  const dispatch = createEventDispatcher<{
    categorySelect: NewKOTDataCategory
  }>()

  $: selectedSubCategories = getSubCategories(selectedDataCategory)

  $: isSelectedCategory = (category: NewKOTCategory) => {
    const subCategories = getSubCategories(dataCategories[category])

    return selectedSubCategories.some((subCategory) => subCategories.includes(subCategory))
  }

  $: isSelectedSubCategoryGroup = (groupSubCategories: NewKOTSubcategory[]) => {
    return selectedSubCategories.some((subCategory) => groupSubCategories.includes(subCategory))
  }

  const handleCategorySelect = (category: NewKOTCategory) => {
    const filteredDataCategory = getDefaultSubCategories(dataCategories[category])

    dispatch('categorySelect', filteredDataCategory)
  }

  const handleSubCategoryGroupSelect = (
    category: NewKOTCategory,
    subCategories: NewKOTSubcategory[]
  ) => {
    const subCategoriesWithYear = [...subCategories, 'year']

    const filteredDataset = dataCategories[category].datasets.map((datapoint) =>
      _.pickBy(datapoint, (_, key) => subCategoriesWithYear.includes(key as NewKOTSubcategory))
    ) as NewKOTDataCategory['datasets']

    // @ts-expect-error The filtered dataset is a type of dataset, but not all.
    dispatch('categorySelect', {
      ...selectedDataCategory,
      datasets: filteredDataset
    })
  }

  const handleSubCategorySelect = (category: NewKOTCategory, subCategory: NewKOTSubcategory) => {
    const groups = chartConfig[category].subCategories.groups

    let subCategories: NewKOTSubcategory[]
    if (groups) {
      subCategories =
        groups.find((group) => group.subCategories.includes(subCategory))?.subCategories ?? []
    } else {
      subCategories = getSubCategories(dataCategories[category])
    }

    const isSelected = !selectedSubCategories.includes(subCategory)

    const newSelectedSubCategories = subCategories.filter((prevSubCategory) =>
      prevSubCategory !== subCategory ? true : isSelected
    )

    const filteredDataset = filterDatasetsBySubCategories(
      dataCategories[category],
      newSelectedSubCategories
    )

    dispatch('categorySelect', filteredDataset)
  }
</script>

<div>
  {#each getCategories(dataCategories) as category (category)}
    <div class={isSelectedCategory(category) ? 'pb-2 md:pb-0' : ''}>
      <div class="flex items-center space-x-2">
        <Checkbox
          id={category}
          aria-labelledby={$t(category)}
          checked={isSelectedCategory(category)}
          disabled={isSelectedCategory(category)}
          class="hover:bg-muted"
          on:click={() => handleCategorySelect(category)}
        />
        <Label
          id={category}
          for={category}
          class="text-base md:text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-4 {isSelectedCategory(
            category
          )
            ? 'pb-2'
            : 'pb-4'} transition-all md:py-1 w-full"
        >
          {$t(category)}
        </Label>
      </div>
      {#if isSelectedCategory(category)}
        <div class="ml-3" transition:slide>
          {#if chartConfig[category].subCategories.groups}
            {#each chartConfig[category].subCategories.groups as group (group.label)}
              <div class="flex items-center space-x-2">
                <Checkbox
                  id={group.label}
                  aria-labelledby={$t(group.label)}
                  class="hover:bg-muted"
                  disabled={isSelectedSubCategoryGroup(group.subCategories)}
                  checked={isSelectedSubCategoryGroup(group.subCategories)}
                  on:click={() => handleSubCategoryGroupSelect(category, group.subCategories)}
                />
                <Label
                  id={group.label}
                  for={group.label}
                  class="text-base md:text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-1.5 w-full"
                >
                  {$t(group.label)}
                </Label>
              </div>
              {#if isSelectedSubCategoryGroup(group.subCategories)}
                <div class="ml-3" transition:slide>
                  {#each group.subCategories as subCategory (subCategory)}
                    <div class="flex items-center space-x-2">
                      <Checkbox
                        id={subCategory}
                        aria-labelledby={$t(category)}
                        disabled={selectedSubCategories.length === 1 &&
                          selectedSubCategories.includes(subCategory)}
                        checked={selectedSubCategories.includes(subCategory)}
                        class="hover:bg-muted"
                        on:click={() => handleSubCategorySelect(category, subCategory)}
                      />
                      <Label
                        id={subCategory}
                        for={subCategory}
                        class="text-base md:text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-2 md:py-1 w-full"
                      >
                        {$t(subCategory)}
                      </Label>
                    </div>
                  {/each}
                </div>
              {/if}
            {/each}
          {:else}
            <div>
              {#each getSubCategories(dataCategories[category]) as subCategory (subCategory)}
                <div class="flex items-center space-x-2">
                  <Checkbox
                    id={subCategory}
                    aria-labelledby={$t(category)}
                    disabled={selectedSubCategories.length === 1 &&
                      selectedSubCategories.includes(subCategory)}
                    checked={selectedSubCategories.includes(subCategory)}
                    class="hover:bg-muted"
                    on:click={() => handleSubCategorySelect(category, subCategory)}
                  />
                  <Label
                    id={subCategory}
                    for={subCategory}
                    class="text-base md:text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-2 md:py-1 w-full"
                  >
                    {$t(subCategory)}
                  </Label>
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
