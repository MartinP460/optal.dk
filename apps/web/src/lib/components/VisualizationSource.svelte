<script lang="ts">
  import { t } from '$lib/i18n/index.svelte'

  type Props = {
    class?: string
  }

  let { class: customClass = '' }: Props = $props()
</script>

<div class="flex text-sm text-muted-foreground {customClass}">
  <p>{t('source')}:&nbsp;</p>
  <a
    href="https://ufsn.dk/statistik/soegning-og-optag-paa-videregaaende-uddannelser/grundtal-om-soegning-og-optagelse"
    target="_blank"
    rel="noopener noreferrer"
    class="hover:underline transition">KOT</a
  >
</div>
