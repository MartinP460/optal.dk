<script lang="ts">
  import '../app.css'
  import clsx from 'clsx'
  import { Toaster } from 'svelte-sonner'
  import { IconMenuDeep } from '@tabler/icons-svelte'
  import type { Locales } from '$lib/i18n'
  import { page } from '$app/stores'
  import DotSeperator from '$lib/components/DotSeperator.svelte'
  import Head from '$lib/components/Head.svelte'
  import Logo from '$lib/components/Logo.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Sheet from '$lib/components/ui/sheet'
  import * as Select from '$lib/components/ui/select'
  import { LOCAL_STORAGE_LANGUAGE, locale, locales, t } from '$lib/i18n'
  import { convertLocaleToDisplayString } from '$lib/utils/convertLocaleToDisplayString'
  import Sidebar from '$lib/components/Sidebar.svelte'

  const selectLocale = { value: $locale }

  $: isHomePath = $page.url.pathname === '/'

  let sheetOpen = false
  let sidebarPage: 'navigation' | 'feedback' = 'navigation'
  let innerWidth = 0

  const handleCloseSidebar = () => {
    sheetOpen = false
    sidebarPage = 'navigation'
  }

  const handleFeedbackCancel = () => {
    if (innerWidth <= 640) {
      sidebarPage = 'navigation'
    } else {
      handleCloseSidebar()
    }
  }

  const handleLocaleChange = (item: unknown) => {
    const { value } = item as { value: Locales }

    locale.set(value)
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE, value)
  }
</script>

<Toaster richColors />
<Head />

<svelte:window bind:innerWidth />

<div class="container mx-auto max-w-5xl px-4 flex flex-col min-h-screen">
  <Sheet.Root bind:open={sheetOpen}>
    <header class={clsx('py-4 flex justify-between', isHomePath && 'flex-row-reverse')}>
      {#if !isHomePath}
        <a href="/" class="flex justify-center"><Logo class="w-24" /></a>
      {/if}
      <div class="flex gap-6">
        <Sheet.Trigger class="sm:hidden" on:click={() => (sidebarPage = 'navigation')}>
          <IconMenuDeep
            class="w-8 h-8 stroke-teal-700 hover:stroke-teal-600 transition-colors"
            stroke={2.3}
          />
        </Sheet.Trigger>
        <Sheet.Trigger class="hidden sm:block">
          <Button on:click={() => (sidebarPage = 'feedback')} variant="ghost" class="font-normal"
            >{$t('feedback')}</Button
          >
        </Sheet.Trigger>
        <Sidebar
          {sidebarPage}
          on:close={handleCloseSidebar}
          on:feedbackCancel={handleFeedbackCancel}
          on:feedbackOpen={() => (sidebarPage = 'feedback')}
        />
        <Select.Root selected={selectLocale} onSelectedChange={handleLocaleChange}>
          <Select.Trigger class="w-32 hidden sm:flex">
            <Select.Value placeholder={convertLocaleToDisplayString(selectLocale.value ?? '')} />
          </Select.Trigger>
          <Select.Content>
            {#each locales as locale}
              <Select.Item value={locale}>{convertLocaleToDisplayString(locale)}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
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
              data-sveltekit-preload-data="tap">{$t('data')}</Button
            >
          </li>
          <DotSeperator class="hidden sm:block" />
          <li>
            <Sheet.Trigger on:click={() => (sidebarPage = 'feedback')}>
              <Button variant="ghost" class="text-gray-600 pb-3" data-sveltekit-preload-data="tap">
                {$t('feedback')}
              </Button>
            </Sheet.Trigger>
          </li>
        </ul>
        <!-- <div class="mt-6 text-sm text-gray-500">
        Created by
        <a
          href="https://www.martpol.dev/"
          class="underline-offset-4 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Martin Polley
        </a>
      </div> -->
      </nav>
    </footer>
  </Sheet.Root>
</div>
