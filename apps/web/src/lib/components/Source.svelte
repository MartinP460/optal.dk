<script lang="ts">
  import { t } from '$lib/i18n'

  let customClass = ''
  export { customClass as class }
</script>

<div class="flex text-sm text-muted-foreground {customClass}">
  <p>{$t('source')}:&nbsp;</p>
  <a
    href="https://ufm.dk/uddannelse/statistik-og-analyser/sogning-og-optag-pa-videregaende-uddannelser/grundtal-om-sogning-og-optag/kot-hovedtal"
    target="_blank"
    rel="noopener noreferrer"
    class="hover:underline transition">KOT</a
  >
</div>
