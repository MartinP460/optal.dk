<script>
  import { createEventDispatcher } from 'svelte'
  import Logo from './Logo.svelte'
  import Button from './ui/button/button.svelte'
  import LanguageSelect from './LanguageSelect.svelte'
  import DarkModeMenu from './DarkModeMenu.svelte'
  import * as Sheet from '$lib/components/ui/sheet'
  import { t } from '$lib/i18n/index.svelte'

  const dispatch = createEventDispatcher()
</script>

<Sheet.Content side="right">
  <Sheet.Header>
    <Sheet.Title class="text-left p-3">
      <a onclick={() => dispatch('close')} href="/">
        <Logo class="w-24" />
      </a>
    </Sheet.Title>
  </Sheet.Header>
  <div class="flex mt-8">
    <LanguageSelect class="w-40 mx-2" />
    <DarkModeMenu />
  </div>
  <nav>
    <ul class="flex flex-col gap-1 mt-8">
      <li>
        <Button
          onclick={() => dispatch('close')}
          href="/about"
          variant="ghost"
          class="w-full justify-start"
        >
          {t('about')}
        </Button>
      </li>
      <li>
        <Button
          onclick={() => dispatch('close')}
          href="/data"
          variant="ghost"
          class="w-full justify-start"
        >
          {t('data')}
        </Button>
      </li>
      <li>
        <Button
          onclick={() => dispatch('close')}
          href="/faq"
          variant="ghost"
          class="w-full justify-start"
        >
          {t('faq')}
        </Button>
      </li>
      <li>
        <Button
          onclick={() => dispatch('feedbackOpen')}
          variant="ghost"
          class="w-full justify-start"
        >
          {t('feedback')}
        </Button>
      </li>
    </ul>
  </nav>
</Sheet.Content>
