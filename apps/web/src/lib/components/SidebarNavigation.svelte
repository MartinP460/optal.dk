<script lang="ts">
  import Logo from './Logo.svelte'
  import Button from './ui/button/button.svelte'
  import LanguageSelect from './LanguageSelect.svelte'
  import DarkModeMenu from './DarkModeMenu.svelte'
  import * as Sheet from '$lib/components/ui/sheet'
  import { t } from '$lib/i18n/index.svelte'

  type Props = {
    onClose: () => void
    onFeedbackOpen: () => void
  }

  let { onClose, onFeedbackOpen }: Props = $props()
</script>

<Sheet.Content side="right">
  <Sheet.Header>
    <Sheet.Title class="text-left p-3">
      <a onclick={onClose} href="/">
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
        <Button onclick={onClose} href="/about" variant="ghost" class="w-full justify-start">
          {t('about')}
        </Button>
      </li>
      <li>
        <Button onclick={onClose} href="/data" variant="ghost" class="w-full justify-start">
          {t('data')}
        </Button>
      </li>
      <li>
        <Button onclick={onClose} href="/faq" variant="ghost" class="w-full justify-start">
          {t('faq')}
        </Button>
      </li>
      <li>
        <Button onclick={onFeedbackOpen} variant="ghost" class="w-full justify-start">
          {t('feedback')}
        </Button>
      </li>
    </ul>
  </nav>
</Sheet.Content>
