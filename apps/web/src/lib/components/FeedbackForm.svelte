<script lang="ts">
  import clsx from 'clsx'
  import type { DrawerTriggerProps } from 'vaul-svelte'
  import type { PopoverTriggerProps } from 'bits-ui'
  import { Check, Loader2 } from '@lucide/svelte'
  import * as Popover from '$lib/components/ui/popover'
  import * as Drawer from '$lib/components/ui/drawer'
  import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte'
  import Textarea from '$lib/components/ui/textarea/textarea.svelte'
  import { t } from '$lib/i18n/index.svelte'
  import { sendFeedback } from '$lib/utils/sendFeedback'
  import { cn } from '$lib/utils'

  type Props = {
    triggerProps?: PopoverTriggerProps | DrawerTriggerProps
  }

  const { triggerProps }: Props = $props()

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay))
  }

  let text: string = $state('')
  let loading = $state(false)
  let success = $state(false)
  let error = $state(false)
  let fieldErrors: string[] = $state([])

  const handleSubmit = async () => {
    fieldErrors = []
    loading = true

    if (!text) {
      fieldErrors = [...fieldErrors, 'content']
    }
    if (!text) {
      loading = false
      return
    }

    const { error: requestError } = await sendFeedback(text)

    await timeout(200)
    loading = false

    if (requestError) {
      error = true
      await timeout(2000)
      error = false
    } else {
      text = ''
      success = true
      await timeout(2000)
      success = false
    }
  }

  let innerWidth = $state(0)
  let isMobile = $derived(innerWidth < 640)

  let Component = $derived(isMobile ? Drawer : Popover)
</script>

<svelte:window bind:innerWidth />

<Component.Root>
  <Component.Trigger
    aria-label="Open feedback form"
    {...triggerProps}
    class={cn(buttonVariants({ variant: 'ghost' }), triggerProps?.class)}
  >
    {t('feedback')}
  </Component.Trigger>
  <Component.Content class={isMobile ? 'px-6 py-2' : 'w-92'}>
    <h3 class={clsx('scroll-m-20 font-bold tracking-tight text-left', isMobile && 'text-lg')}>
      {t('feedback')}
    </h3>

    <p class={clsx('text-muted-foreground', !isMobile && 'text-sm')}>
      {t('feedbackInfo')}
    </p>

    <form onsubmit={handleSubmit} class="flex flex-col gap-4 mt-4">
      <div class="flex flex-col">
        <Textarea
          bind:value={text}
          id="content"
          placeholder={t('feedbackPlaceholder')}
          class={clsx('min-h-[133px]', fieldErrors.includes('content') && 'border-red-500')}
        />
      </div>
      <div class="flex flex-col">
        <Button
          type="submit"
          disabled={loading || success || error}
          class={clsx(
            'transition',
            success && 'bg-green-500 hover:bg-green-500 cursor-default opacity-90!',
            error && 'bg-red-500 hover:bg-red-500 cursor-default opacity-90! sm:text-sm text-xs'
          )}
        >
          <Check class={clsx('mr-2 h-4 w-4 transition-all', !success && 'hidden')} />
          <Loader2 class={clsx('mr-2 h-4 w-4 animate-spin transition-all', !loading && 'hidden')} />
          {#if success}
            {t('submitted')}
          {:else if error}
            {t('error')}
          {:else if loading}
            {t('submitting')}
          {:else}
            {t('submit')}
          {/if}
        </Button>
      </div>
    </form>
  </Component.Content>
</Component.Root>
