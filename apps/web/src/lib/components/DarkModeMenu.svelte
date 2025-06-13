<script lang="ts">
  import Sun from 'lucide-svelte/icons/sun'
  import Moon from 'lucide-svelte/icons/moon'

  import { resetMode, setMode } from 'mode-watcher'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import { Button } from '$lib/components/ui/button/index.js'
  import { t } from '$lib/i18n'

  type Props = {
    class?: string
  }

  let { class: customClass = '' }: Props = $props()
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" size="icon" class={customClass}>
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">{$t('toggleTheme')}</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item on:click={() => setMode('light')}>{$t('lightMode')}</DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => setMode('dark')}>{$t('darkMode')}</DropdownMenu.Item>
    <DropdownMenu.Item on:click={() => resetMode()}>{$t('systemMode')}</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
