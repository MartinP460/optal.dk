<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import _ from 'lodash'
  import type { KOTCategory } from 'parser'
  import * as Accordion from '$lib/components/ui/accordion'
  import * as Card from '$lib/components/ui/card'
  import DotSeperator from '$lib/components/DotSeperator.svelte'
  import Title from '$lib/components/Title.svelte'
  import { t } from '$lib/i18n'

  export let descriptionOpts: {
    categoriesToDisplay: Array<KOTCategory>
    type: 'institution' | 'course'
  }

  const shouldDisplay = (category: KOTCategory) =>
    descriptionOpts.categoriesToDisplay.includes(category)

  const i18nType = _.capitalize(descriptionOpts.type) as 'Institution' | 'Course'
</script>

<Card.Root class="w-full md:w-[800px] px-6 py-2 mt-12 mx-auto">
  <Accordion.Root multiple aria-hidden>
    <Accordion.Item value="categories-description" class="border-0">
      <Accordion.Trigger>
        {$t(`infoCategories${i18nType}`)}
      </Accordion.Trigger>
      <Accordion.Content>
        {#if shouldDisplay('accepted')}
          <Title element="h4" variant="h5" class="mb-2 flex gap-4"
            >{$t('accepted')}<DotSeperator class="bg-lime-700" /></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('admitted')}</Title>
          <p>
            {$t(`infoAcceptedAdmitted${i18nType}`)}
          </p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('standby')}</Title>
          <p
            class="prose-a:underline prose-a:underline-offset-2 prose-a:decoration-emerald-500 hover:prose-a:text-emerald-600 prose-a:transition-colors"
          >
            {@html $t(`infoAcceptedStandby${i18nType}`)}
          </p>
        {/if}

        {#if shouldDisplay('applied')}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{$t('applied')}<DotSeperator class="bg-yellow-700" /></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('firstPriority')}</Title>
          <p>{$t(`infoAppliedFirstpriority${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('total')}</Title>
          <p>{$t(`infoAppliedTotal${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay('quotient')}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{$t('quotient')}<DotSeperator class="bg-rose-800" /></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('primary')}</Title>
          <p>{$t(`infoQuotientPrimary${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('standby')}</Title>
          <p>{$t(`infoQuotientStandby${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay('gender')}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{$t('gender')}<DotSeperator class="bg-fuchsia-400" /></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('accepted')}</Title>
          <p>{$t(`infoGenderAccepted${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('applied')}</Title>
          <p>{$t(`infoGenderApplied${i18nType}`)}</p>
        {/if}
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>

  <div class="sr-only">
    <h3>{$t(`infoCategories${i18nType}`)}</h3>

    {#if shouldDisplay('accepted')}
      <h4>{$t('accepted')}</h4>
      <h5>{$t('admitted')}</h5>
      <p>{$t(`infoAcceptedAdmitted${i18nType}`)}</p>
      <h5>{$t('standby')}</h5>
      <p>{@html $t(`infoAcceptedStandby${i18nType}`)}</p>
    {/if}

    {#if shouldDisplay('applied')}
      <h4>{$t('applied')}</h4>
      <h5>{$t('firstPriority')}</h5>
      <p>{$t(`infoAppliedFirstpriority${i18nType}`)}</p>
      <h5>{$t('total')}</h5>
      <p>{$t(`infoAppliedTotal${i18nType}`)}</p>
    {/if}

    {#if shouldDisplay('quotient')}
      <h4>{$t('quotient')}</h4>
      <h5>{$t('primary')}</h5>
      <p>{$t(`infoQuotientPrimary${i18nType}`)}</p>
      <h5>{$t('standby')}</h5>
      <p>{$t(`infoQuotientStandby${i18nType}`)}</p>
    {/if}

    {#if shouldDisplay('gender')}
      <h4>{$t('gender')}</h4>
      <h5>{$t('accepted')}</h5>
      <p>{$t(`infoGenderAccepted${i18nType}`)}</p>
      <h5>{$t('applied')}</h5>
      <p>{$t(`infoGenderApplied${i18nType}`)}</p>
    {/if}
  </div>
</Card.Root>
