<script lang="ts">
  import type { KOTSubcategory } from 'parser'
  import { t } from '$lib/i18n'
  import { getNewGetColorFromDataset } from '$lib/utils/getColorFromDataset'
  import Source from '$lib/components/Source.svelte'

  export let labels: {
    group: 'genderAccepted' | 'genderApplied' | null
    label: KOTSubcategory
  }[]
</script>

<div class="flex justify-between mt-4 gap-8">
  <div class="flex flex-wrap gap-2 sm:gap-4">
    {#each labels as { group, label } (label)}
      <span class="flex items-center gap-2 text-sm text-muted-foreground">
        <div
          class="w-3 h-3 rounded"
          style={`background-color: ${getNewGetColorFromDataset(label)}`}
        />
        {group ? `${$t(group)} - ${$t(label)}` : $t(label)}
      </span>
    {/each}
  </div>
  <Source />
</div>
