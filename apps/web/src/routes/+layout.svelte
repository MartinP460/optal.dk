<script lang="ts">
  import '../app.css'
  import clsx from 'clsx'
  import { page } from '$app/stores'
  import DotSeperator from '$lib/components/DotSeperator.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Select from '$lib/components/ui/select'
  import { locales, locale, LOCAL_STORAGE_LANGUAGE, t } from '$lib/i18n'
  import type { Locales } from '$lib/i18n'
  import { convertLocaleToDisplayString } from '$lib/utils/convertLocaleToDisplayString'

  const selectLocale = { value: $locale }

  $: isHomePath = $page.url.pathname === '/'

  const handleLocaleChange = (item: unknown) => {
    const { value } = item as { value: Locales }

    locale.set(value)
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE, value)
  }
</script>

<div class="container mx-auto max-w-5xl px-4 flex flex-col min-h-screen">
  <header class={clsx('py-4 flex justify-between', isHomePath && 'flex-row-reverse')}>
    {#if !isHomePath}
      <a href="/" class="font-medium text-lg">op<span class="text-teal-600">tal</span>.dk</a>
    {/if}
    <Select.Root selected={selectLocale} onSelectedChange={(value) => handleLocaleChange(value)}>
      <Select.Trigger class="w-32">
        <Select.Value placeholder={convertLocaleToDisplayString(selectLocale.value ?? '')} />
      </Select.Trigger>
      <Select.Content>
        {#each locales as locale}
          <Select.Item value={locale}>{convertLocaleToDisplayString(locale)}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </header>
  <slot />
  <footer class="w-full flex justify-center mt-auto">
    <nav class="flex flex-col my-12 items-center">
      <ul class="flex gap-x-4 flex-wrap justify-center gap-y-2 w-72 sm:w-fit">
        <li>
          <Button
            href="/about"
            variant="ghost"
            class="text-gray-600 pb-3 w-24"
            data-sveltekit-preload-data="tap"
          >
            {$t('aboutUs')}
          </Button>
        </li>
        <DotSeperator />
        <li>
          <Button
            href="/data"
            variant="ghost"
            class="text-gray-600 pb-3 w-24"
            data-sveltekit-preload-data="tap">Data</Button
          >
        </li>
        <DotSeperator class="hidden sm:block" />
        <li>
          <Button variant="ghost" class="text-gray-600 pb-3">Another link</Button>
        </li>
        <DotSeperator />
        <li>
          <Button variant="ghost" class="text-gray-600 pb-3">Another link</Button>
        </li>
      </ul>
      <div class="mt-6 text-sm text-gray-500">
        Created by
        <a
          href="https://www.martpol.dev/"
          class="underline-offset-4 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Martin Polley
        </a>
      </div>
    </nav>
  </footer>
</div>
