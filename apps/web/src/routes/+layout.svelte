<script lang="ts">
  import '../app.css'
  import clsx from 'clsx'
  import { Toaster } from 'svelte-sonner'
  import { IconMenuDeep } from '@tabler/icons-svelte'
  import { ModeWatcher } from 'mode-watcher'
  import { page } from '$app/stores'
  import DotSeperator from '$lib/components/DotSeperator.svelte'
  import Head from '$lib/components/Head.svelte'
  import Logo from '$lib/components/Logo.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Sheet from '$lib/components/ui/sheet'
  import { t } from '$lib/i18n'
  import Sidebar from '$lib/components/Sidebar.svelte'
  import LanguageSelect from '$lib/components/LanguageSelect.svelte'
  import DarkModeMenu from '$lib/components/DarkModeMenu.svelte'

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
</script>

<Toaster richColors />
<ModeWatcher />
<Head />

<svelte:window bind:innerWidth />

<div class="container mx-auto max-w-5xl px-4 flex flex-col min-h-screen">
  <Sheet.Root bind:open={sheetOpen}>
    <header class={clsx('py-4 flex justify-between', isHomePath && 'flex-row-reverse')}>
      {#if !isHomePath}
        <a href="/" class="flex justify-center" aria-label="Go to homepage"><Logo class="w-24" /></a
        >
      {/if}
      <div class="flex sm:gap-6">
        <Sheet.Trigger
          on:click={() => (sidebarPage = 'navigation')}
          aria-label="Open sidebar navigation"
        >
          <IconMenuDeep
            class="w-8 h-8 stroke-teal-700 hover:stroke-teal-600 transition-colors sm:hidden"
            stroke={2.3}
          />
        </Sheet.Trigger>
        <Sheet.Trigger aria-label="Open feedback form" on:click={() => (sidebarPage = 'feedback')}>
          <Button variant="ghost" class="font-normal hidden sm:block">
            {$t('feedback')}
          </Button>
        </Sheet.Trigger>
        <DarkModeMenu class="hidden sm:flex" />
        <Sidebar
          {sidebarPage}
          on:close={handleCloseSidebar}
          on:feedbackCancel={handleFeedbackCancel}
          on:feedbackOpen={() => (sidebarPage = 'feedback')}
        />
        <LanguageSelect class="w-32 hidden sm:flex" />
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
              class="text-muted-foreground pb-3 w-24"
              data-sveltekit-preload-data="tap"
            >
              {$t('about')}
            </Button>
          </li>
          <DotSeperator aria-hidden />
          <li>
            <Button
              href="/data"
              variant="ghost"
              class="text-muted-foreground pb-3 w-24"
              data-sveltekit-preload-data="tap">{$t('data')}</Button
            >
          </li>
          <DotSeperator aria-hidden class="hidden sm:block" />
          <li>
            <Button
              href="/faq"
              variant="ghost"
              class="text-muted-foreground pb-3 w-24"
              data-sveltekit-preload-data="tap">{$t('faq')}</Button
            >
          </li>
          <DotSeperator aria-hidden />
          <li>
            <Sheet.Trigger on:click={() => (sidebarPage = 'feedback')}>
              <Button
                variant="ghost"
                class="text-muted-foreground pb-3"
                data-sveltekit-preload-data="tap"
              >
                {$t('feedback')}
              </Button>
            </Sheet.Trigger>
          </li>
        </ul>
      </nav>
    </footer>
  </Sheet.Root>
</div>
