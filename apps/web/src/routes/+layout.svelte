<script lang="ts">
  import '../app.css'
  import clsx from 'clsx'
  import { IconMenuDeep } from '@tabler/icons-svelte'
  import { ModeWatcher } from 'mode-watcher'
  import { page } from '$app/state'
  import DotSeperator from '$lib/components/DotSeperator.svelte'
  import Head from '$lib/components/Head.svelte'
  import Logo from '$lib/components/Logo.svelte'
  import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte'
  import * as Sheet from '$lib/components/ui/sheet'
  import { t } from '$lib/i18n/index.svelte'
  import Sidebar from '$lib/components/Sidebar.svelte'
  import LanguageSelect from '$lib/components/LanguageSelect.svelte'
  import DarkModeMenu from '$lib/components/DarkModeMenu.svelte'
  import Credits from '$lib/components/Credits.svelte'
  import { cn } from '$lib/utils'

  let { children } = $props()

  let isHomePath = $derived(page.url.pathname === '/')

  let sheetOpen = $state(false)
  let sidebarPage: 'navigation' | 'feedback' = $state('navigation')
  let innerWidth = $state(0)

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
          onclick={() => (sidebarPage = 'navigation')}
          aria-label="Open sidebar navigation"
        >
          <IconMenuDeep
            class="w-8 h-8 stroke-teal-700 hover:stroke-teal-600 transition-colors sm:hidden"
            stroke={2.3}
          />
        </Sheet.Trigger>
        <Sheet.Trigger
          aria-label="Open feedback form"
          onclick={() => (sidebarPage = 'feedback')}
          class={cn(buttonVariants({ variant: 'ghost' }), 'font-normal hidden sm:block')}
        >
          {t('feedback')}
        </Sheet.Trigger>
        <DarkModeMenu class="hidden sm:flex" />
        <Sidebar
          {sidebarPage}
          onClose={handleCloseSidebar}
          onFeedbackCancel={handleFeedbackCancel}
          onFeedbackOpen={() => (sidebarPage = 'feedback')}
        />
        <LanguageSelect class="w-32 hidden sm:flex" />
      </div>
    </header>
    {@render children()}
    <footer class="w-full flex flex-col items-center mt-auto">
      <nav class="flex flex-col my-12 items-center">
        <ul class="flex gap-x-4 flex-wrap justify-center gap-y-2 w-72 sm:w-fit">
          <li>
            <Button
              href="/about"
              variant="ghost"
              class="text-muted-foreground pb-3 w-24"
              data-sveltekit-preload-data="tap"
            >
              {t('about')}
            </Button>
          </li>
          <DotSeperator />
          <li>
            <Button
              href="/data"
              variant="ghost"
              class="text-muted-foreground pb-3 w-24"
              data-sveltekit-preload-data="tap">{t('data')}</Button
            >
          </li>
          <DotSeperator class="hidden sm:block" />
          <li>
            <Button
              href="/faq"
              variant="ghost"
              class="text-muted-foreground pb-3 w-24"
              data-sveltekit-preload-data="tap">{t('faq')}</Button
            >
          </li>
          <DotSeperator />
          <li>
            <Sheet.Trigger
              onclick={() => (sidebarPage = 'feedback')}
              class={cn(buttonVariants({ variant: 'ghost' }), 'text-muted-foreground pb-3')}
            >
              {t('feedback')}
            </Sheet.Trigger>
          </li>
        </ul>
      </nav>
      <div class="lg:absolute lg:right-16 lg:mt-14 mb-12">
        <Credits />
      </div>
    </footer>
  </Sheet.Root>
</div>
