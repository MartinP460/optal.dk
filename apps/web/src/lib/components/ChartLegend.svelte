<script lang="ts">
  import type { KOTSubcategory } from 'reader'
  import { t } from '$lib/i18n'
  import { getColorFromSubcategory } from '$lib/utils/getColorFromDataset'
  import Source from '$lib/components/Source.svelte'

  export let group: 'genderAccepted' | 'genderApplied' | 'ageAccepted' | 'ageApplied' | null
  export let labels: KOTSubcategory[]
</script>

<div class="flex justify-between mt-4 gap-8 sm:items-center">
  <div>
    {#if group}
      <p class="text-muted-foreground text-sm">({$t(group)})</p>
    {/if}
    <div class="grid grid-cols-2 sm:grid-cols-5 lg:flex gap-x-2 sm:gap-x-4 mt-0.5">
      {#each labels as label (label)}
        <span class="flex items-center gap-2 text-sm text-muted-foreground">
          <div
            class="w-3 h-3 rounded"
            style={`background-color: ${getColorFromSubcategory(label)}`}
          />
          {$t(label)}
        </span>
      {/each}
    </div>
  </div>
  <Source />
</div>
