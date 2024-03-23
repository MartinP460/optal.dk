<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import clsx from 'clsx'
  import { AlertCircle, Check, Loader2 } from 'lucide-svelte'
  import * as Sheet from '$lib/components/ui/sheet'
  import * as Alert from '$lib/components/ui/alert'
  import Button from '$lib/components/ui/button/button.svelte'
  import Label from '$lib/components/ui/label/label.svelte'
  import Textarea from '$lib/components/ui/textarea/textarea.svelte'
  import { t } from '$lib/i18n'
  import { sendFeedback } from '$lib/utils/sendFeedback'

  const dispatch = createEventDispatcher()

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay))
  }

  let text: string
  let loading = false
  let success = false
  let error = false
  let fieldErrors: string[] = []

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
</script>

<Sheet.Content class="lg:max-w-md">
  <Sheet.Header>
    <Sheet.Title>
      <h3 class="scroll-m-20 font-bold tracking-tight text-2xl mt-4 text-left">
        {$t('feedback')}
      </h3>
    </Sheet.Title>
  </Sheet.Header>

  <Alert.Root variant="default" class="mt-4">
    <AlertCircle class="h-4 w-4 stroke-gray-700" />
    <Alert.Description class="mt-[1px] text-gray-700">
      {$t('feedbackInfo')}
    </Alert.Description>
  </Alert.Root>

  <form on:submit={handleSubmit} class="flex flex-col gap-6 mt-8">
    <div class="flex flex-col gap-1.5">
      <Label for="content">{$t('content')} <span class="text-red-500">*</span></Label>
      <Textarea
        bind:value={text}
        id="content"
        placeholder={$t('feedbackPlaceholder')}
        class={clsx('min-h-[133px]', fieldErrors.includes('content') && 'border-red-500')}
      />
    </div>
    <div class="flex flex-col gap-2">
      <Button
        type="submit"
        disabled={loading || success || error}
        class={clsx(
          'transition',
          success && 'bg-green-500 hover:bg-green-500 cursor-default !opacity-90',
          error && 'bg-red-500 hover:bg-red-500 cursor-default !opacity-90 sm:text-sm text-xs'
        )}
      >
        <Check class={clsx('mr-2 h-4 w-4 transition-all', !success && 'hidden')} />
        <Loader2 class={clsx('mr-2 h-4 w-4 animate-spin transition-all', !loading && 'hidden')} />
        {#if success}
          {$t('submitted')}
        {:else if error}
          {$t('error')}
        {:else if loading}
          {$t('submitting')}
        {:else}
          {$t('submit')}
        {/if}
      </Button>
      <Button on:click={() => dispatch('cancel')} type="button" variant="outline"
        >{$t('cancel')}
      </Button>
    </div>
  </form>
</Sheet.Content>
