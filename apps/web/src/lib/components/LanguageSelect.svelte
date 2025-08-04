<script lang="ts">
  import type { Locales } from '$lib/i18n/index.svelte'
  import * as Select from '$lib/components/ui/select'
  import { convertLocaleToDisplayString } from '$lib/utils/convertLocaleToDisplayString'
  import { LOCAL_STORAGE_LANGUAGE, locale, locales } from '$lib/i18n/index.svelte'

  type Props = {
    class?: string
  }

  let { class: customClass = '' }: Props = $props()

  const handleLocaleChange = (value: string) => {
    locale.value = value as Locales
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE, value)
  }
</script>

<Select.Root type="single" value={locale.value} onValueChange={handleLocaleChange}>
  <Select.Trigger class={customClass}>
    {convertLocaleToDisplayString(locale.value ?? '')}
  </Select.Trigger>
  <Select.Content>
    {#each locales as localeOption (localeOption)}
      <Select.Item value={localeOption}>{convertLocaleToDisplayString(localeOption)}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
