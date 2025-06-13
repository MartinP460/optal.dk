<script lang="ts">
  import type { Locales } from '$lib/i18n'
  import * as Select from '$lib/components/ui/select'
  import { convertLocaleToDisplayString } from '$lib/utils/convertLocaleToDisplayString'
  import { LOCAL_STORAGE_LANGUAGE, locale, locales } from '$lib/i18n'

  type Props = {
    class?: string
  }

  let { class: customClass = '' }: Props = $props()

  const selectLocale = { value: $locale }

  const handleLocaleChange = (item: unknown) => {
    const { value } = item as { value: Locales }

    locale.set(value)
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE, value)
  }
</script>

<Select.Root selected={selectLocale} onSelectedChange={handleLocaleChange}>
  <Select.Trigger class={customClass}>
    <Select.Value placeholder={convertLocaleToDisplayString(selectLocale.value ?? '')} />
  </Select.Trigger>
  <Select.Content>
    {#each locales as locale}
      <Select.Item value={locale}>{convertLocaleToDisplayString(locale)}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
