<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import _ from 'lodash'
  import type { KOTCategory } from '@optaldk/reader'
  import * as Accordion from '$lib/components/ui/accordion'
  import * as Card from '$lib/components/ui/card'
  import Title from '$lib/components/Title.svelte'
  import { t } from '$lib/i18n/index.svelte'

  interface Props {
    descriptionOpts: {
      categoriesToDisplay: Array<KOTCategory>
      type: 'institution' | 'course' | 'grouping'
    }
    coursesInInstitution?: import('svelte').Snippet
    coursesInGrouping?: import('svelte').Snippet
  }

  let { descriptionOpts, coursesInInstitution, coursesInGrouping }: Props = $props()

  const shouldDisplay = (category: KOTCategory) =>
    descriptionOpts.categoriesToDisplay.includes(category)

  const i18nType = _.capitalize(descriptionOpts.type) as 'Institution' | 'Course' | 'Grouping'
</script>

<Card.Root class="w-full max-w-[800px] px-6 py-2 mt-12 mx-auto">
  <Accordion.Root type="multiple" aria-disabled>
    <Accordion.Item value="categories-description">
      <Accordion.Trigger>
        {t(`infoCategories${i18nType}`)}
      </Accordion.Trigger>
      <Accordion.Content>
        {#if shouldDisplay('accepted')}
          <Title element="h4" variant="h5" class="mb-2 flex gap-4"
            >{t('accepted')}
            <div class="bg-lime-700 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('admitted')}</Title>
          <p>
            {t(`infoAcceptedAdmitted${i18nType}`)}
          </p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('standby')}</Title>
          <p
            class="prose-a:underline prose-a:underline-offset-2 prose-a:decoration-emerald-500 hover:prose-a:text-emerald-600 prose-a:transition-colors"
          >
            {@html t(`infoAcceptedStandby${i18nType}`)}
          </p>
        {/if}

        {#if shouldDisplay('applied')}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('applied')}
            <div class="bg-yellow-700 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('firstPriority')}</Title>
          <p>{t(`infoAppliedFirstpriority${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('total')}</Title>
          <p>{t(`infoAppliedTotal${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay('quotient')}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('quotient')}
            <div class="bg-rose-800 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('primary')}</Title>
          <p>{t(`infoQuotientPrimary${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('standby')}</Title>
          <p>{t(`infoQuotientStandby${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay('gender')}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('gender')}
            <div class="bg-fuchsia-400 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('accepted')}</Title>
          <p>{t(`infoGenderAccepted${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('applied')}</Title>
          <p>{t(`infoGenderApplied${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay('age')}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('age')}
            <div class="bg-purple-500 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('accepted')}</Title>
          <p>{t(`infoAgeAccepted${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('applied')}</Title>
          <p>{t(`infoAgeApplied${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay('education')}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('education')}
            <div class="bg-amber-800 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('accepted')}</Title>
          <p>{t(`infoEducationAccepted${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('applied')}</Title>
          <p>{t(`infoEducationApplied${i18nType}`)}</p>
        {/if}
      </Accordion.Content>
    </Accordion.Item>
    {#if coursesInInstitution}
      <Accordion.Item value="courses">
        <Accordion.Trigger>
          {t('courses')}
        </Accordion.Trigger>
        <Accordion.Content>
          {@render coursesInInstitution?.()}
        </Accordion.Content>
      </Accordion.Item>
    {/if}
    {#if coursesInGrouping}
      <Accordion.Item value="courses">
        <Accordion.Trigger>
          {t('coursesInEducation')}
        </Accordion.Trigger>
        <Accordion.Content>
          {@render coursesInGrouping?.()}
        </Accordion.Content>
      </Accordion.Item>
    {/if}
  </Accordion.Root>
</Card.Root>
