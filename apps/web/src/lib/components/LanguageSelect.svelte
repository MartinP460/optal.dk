<script lang="ts">
  import { LOCALES, type Locale } from '@optaldk/i18n'
  import * as Select from '$lib/components/ui/select'
  import { convertLocaleToDisplayString } from '$lib/utils/convertLocaleToDisplayString'
  import { LOCAL_STORAGE_LANGUAGE, locale } from '$lib/i18n/index.svelte'

  type Props = {
    class?: string
  }

  let { class: customClass = '' }: Props = $props()

  const handleLocaleChange = (value: string) => {
    locale.value = value as Locale
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE, value)
  }
</script>

<Select.Root type="single" value={locale.value} onValueChange={handleLocaleChange}>
  <Select.Trigger class={customClass}>
    {convertLocaleToDisplayString(locale.value ?? '')}
  </Select.Trigger>
  <Select.Content>
    {#each LOCALES as locale (locale)}
      <Select.Item value={locale}>{convertLocaleToDisplayString(locale)}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
