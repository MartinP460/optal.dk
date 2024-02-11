<script lang="ts">
  import clsx from 'clsx'
  import { AlertCircle, Loader2 } from 'lucide-svelte'
  import { toast } from 'svelte-sonner'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Container from '$lib/components/Container.svelte'
  import * as Alert from '$lib/components/ui/alert'
  import Button from '$lib/components/ui/button/button.svelte'
  import Label from '$lib/components/ui/label/label.svelte'
  import * as Select from '$lib/components/ui/select'
  import Textarea from '$lib/components/ui/textarea/textarea.svelte'
  import { t } from '$lib/i18n'
  import type { Feedback } from '$lib/types/feedback'
  import { sendFeedback } from '$lib/utils/sendFeedback'

  $: breadcrumbRoutes = [{ text: $t('feedback'), url: '/about' }]

  let type: { value: Feedback; label: string } | null
  let text: string
  let loading = false
  let fieldErrors: string[] = []

  const handleSubmit = async () => {
    fieldErrors = []
    loading = true

    if (!text) {
      fieldErrors = [...fieldErrors, 'content']
    }
    if (!type) {
      fieldErrors = [...fieldErrors, 'type']
    }
    if (!text || !type) {
      loading = false
      return
    }

    const { error } = await sendFeedback(text, type.value)

    if (error) {
      loading = false
      toast.error($t('error'))
      return
    }

    toast.success($t('feedbackSuccess'))

    type = null
    text = ''
    loading = false
  }

  const handleTypeChange = (value: unknown) => {
    // the library has bad typing ):
    const newValue = value as { value: Feedback; label: string }
    type = newValue
  }

  $: options = [
    {
      value: 'bug',
      label: $t('problemOrBug')
    },
    {
      value: 'feature',
      label: $t('suggestionForImprovement')
    },
    {
      value: 'other',
      label: $t('other')
    }
  ]
</script>

<Container>
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-4 mb-8">
    {$t('feedback')}
  </h1>

  <Alert.Root variant="default" class="mt-0.5">
    <AlertCircle class="h-4 w-4 stroke-gray-700" />
    <Alert.Description class="mt-[1px] text-gray-700">
      {$t('feedbackInfo')}
    </Alert.Description>
  </Alert.Root>

  <form on:submit={handleSubmit} class="flex flex-col gap-4 mt-8">
    <div class="flex flex-col gap-1.5">
      <Label for="type">Type <span class="text-red-500">*</span></Label>
      <Select.Root selected={type} onSelectedChange={handleTypeChange}>
        <Select.Trigger id="type" class={clsx(fieldErrors.includes('type') && 'border-red-500')}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {#each options as option}
            <Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <div class="flex flex-col gap-1.5">
      <Label for="content">Content <span class="text-red-500">*</span></Label>
      <Textarea
        bind:value={text}
        id="content"
        placeholder={$t('feedbackPlaceholder')}
        class={clsx('min-h-[133px]', fieldErrors.includes('content') && 'border-red-500')}
      />
    </div>
    <Button disabled={loading}>
      {#if loading}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      {/if}
      Submit
    </Button>
  </form>
</Container>
