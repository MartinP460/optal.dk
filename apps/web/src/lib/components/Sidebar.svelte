<script lang="ts">
  import { IconMenuDeep } from '@tabler/icons-svelte'
  import Logo from './Logo.svelte'
  import Button from './ui/button/button.svelte'
  import LanguageSelect from './LanguageSelect.svelte'
  import DarkModeMenu from './DarkModeMenu.svelte'
  import FeedbackForm from './FeedbackForm.svelte'
  import * as Sheet from '$lib/components/ui/sheet'
  import { t } from '$lib/i18n/index.svelte'
  import { resolve } from '$app/paths'

  let open = $state(false)
  const onClose = () => (open = false)
</script>

<Sheet.Root bind:open>
  <Sheet.Trigger aria-label="Open sidebar navigation">
    <IconMenuDeep
      class="w-8 h-8 stroke-teal-700 hover:stroke-teal-600 transition-colors sm:hidden"
      stroke={2.3}
    />
  </Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title class="text-left p-3">
        <a onclick={onClose} href={resolve('/')}>
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
            onclick={onClose}
            href="/about"
            variant="ghost"
            class="w-full justify-start text-lg"
          >
            {t('about')}
          </Button>
        </li>
        <li>
          <Button
            onclick={onClose}
            href="/data"
            variant="ghost"
            class="w-full justify-start text-lg"
          >
            {t('data')}
          </Button>
        </li>
        <li>
          <Button
            onclick={onClose}
            href="/faq"
            variant="ghost"
            class="w-full justify-start text-lg"
          >
            {t('faq')}
          </Button>
        </li>
        <li>
          <FeedbackForm triggerProps={{ class: 'text-lg' }} />
        </li>
      </ul>
    </nav>
  </Sheet.Content>
</Sheet.Root>
