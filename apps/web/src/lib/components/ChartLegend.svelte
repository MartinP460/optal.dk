<script lang="ts">
  import type { KOTSubcategory } from 'reader'
  import { t } from '$lib/i18n'
  import { getColorFromSubcategory } from '$lib/utils/getColorFromDataset'
  import Source from '$lib/components/Source.svelte'

  export let group:
    | 'genderAccepted'
    | 'genderApplied'
    | 'ageAccepted'
    | 'ageApplied'
    | 'edAccepted'
    | 'edApplied'
    | null

  export let labels: KOTSubcategory[]
</script>

<div class="flex flex-col sm:flex-row-reverse justify-between mt-4 sm:gap-8 sm:items-center">
  <Source class="self-end sm:self-start" />
  <div>
    {#if group}
      <p class="text-muted-foreground text-sm">({$t(group)})</p>
    {/if}
    <div class="flex flex-wrap gap-x-5 gap-y-2 mt-2">
      {#each labels as label (label)}
        <span class="flex items-center gap-2 text-sm text-muted-foreground">
          <div
            class="w-3 h-3 rounded flex-shrink-0"
            style={`background-color: ${getColorFromSubcategory(label)}`}
          />
          {$t(label)}
        </span>
      {/each}
    </div>
  </div>
</div>
