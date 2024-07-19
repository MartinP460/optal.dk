<script lang="ts">
  import type { KOTSubcategory } from 'parser'
  import { t } from '$lib/i18n'
  import { getNewGetColorFromDataset } from '$lib/utils/getColorFromDataset'

  export let labels: {
    group: 'genderAccepted' | 'genderApplied' | null
    label: KOTSubcategory
  }[]
</script>

<div class="flex justify-between mt-4 text-sm text-muted-foreground gap-8">
  <div class="flex flex-wrap gap-2 sm:gap-4">
    {#each labels as { group, label } (label)}
      <span class="flex items-center gap-2">
        <div
          class="w-3 h-3 rounded"
          style={`background-color: ${getNewGetColorFromDataset(label)}`}
        />
        {group ? `${$t(group)} - ${$t(label)}` : $t(label)}
      </span>
    {/each}
  </div>
  <div class="flex">
    <p>{$t('source')}:&nbsp;</p>
    <a
      href="https://ufm.dk/uddannelse/statistik-og-analyser/sogning-og-optag-pa-videregaende-uddannelser/grundtal-om-sogning-og-optag/kot-hovedtal"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:underline transition">KOT</a
    >
  </div>
</div>
