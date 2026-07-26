<script lang="ts">
  import '../app.css'
  import clsx from 'clsx'
  import { ModeWatcher } from 'mode-watcher'
  import { page } from '$app/state'
  import { t } from '$lib/i18n/index.svelte'
  import DotSeperator from '$lib/components/DotSeperator.svelte'
  import Head from '$lib/components/Head.svelte'
  import Logo from '$lib/components/Logo.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import LanguageSelect from '$lib/components/LanguageSelect.svelte'
  import DarkModeMenu from '$lib/components/DarkModeMenu.svelte'
  import Credits from '$lib/components/Credits.svelte'
  import Sidebar from '$lib/components/Sidebar.svelte'
  import FeedbackForm from '$lib/components/FeedbackForm.svelte'
  import { resolve } from '$app/paths'

  let { children } = $props()

  let isHomePath = $derived(page.url.pathname === '/')
</script>

<ModeWatcher />
<Head />

<div class="container mx-auto max-w-5xl px-4 flex flex-col min-h-screen">
  <header class={clsx('py-4 flex justify-between', isHomePath && 'flex-row-reverse')}>
    {#if !isHomePath}
      <a href={resolve('/')} class="flex justify-center" aria-label="Go to homepage"
        ><Logo class="w-24" /></a
      >
    {/if}
    <div class="flex sm:gap-6">
      <Sidebar />
      <FeedbackForm triggerProps={{ class: 'hidden sm:flex font-normal' }} />
      <DarkModeMenu class="hidden sm:flex" />
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
      </ul>
    </nav>
    <div class="lg:absolute lg:right-16 lg:mt-14 mb-12">
      <Credits />
    </div>
  </footer>
</div>
