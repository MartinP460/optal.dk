<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import * as Accordion from '$lib/components/ui/accordion'
  import * as Card from '$lib/components/ui/card'
  import Title from '$lib/components/Title.svelte'
  import { t } from '$lib/i18n'
</script>

<Card.Root class="w-full sm:w-[800px] px-6 py-2 mt-12 mx-auto">
  <Accordion.Root multiple aria-hidden>
    <Accordion.Item value="categories-description" class="border-0">
      <Accordion.Trigger>
        {$t('infoCategories')}
      </Accordion.Trigger>
      <Accordion.Content>
        <Title element="h4" variant="h5" class="mb-2">{$t('accepted')}</Title>
        <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('admitted')}</Title>
        <p>{$t('infoAcceptedAdmitted')}</p>
        <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('standby')}</Title>
        <p
          class="prose-a:underline prose-a:underline-offset-2 prose-a:decoration-emerald-500 hover:prose-a:text-emerald-600 prose-a:transition-colors"
        >
          {@html $t('infoAcceptedStandby')}
        </p>

        <Title element="h4" variant="h5" class="mb-2 mt-4">{$t('applied')}</Title>
        <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('firstPriority')}</Title>
        <p>{$t('infoAppliedFirstpriority')}</p>
        <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('total')}</Title>
        <p>{$t('infoAppliedTotal')}</p>

        <Title element="h4" variant="h5" class="mb-2 mt-4">{$t('quotient')}</Title>
        <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('primary')}</Title>
        <p>{$t('infoQuotientPrimary')}</p>
        <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('standby')}</Title>
        <p>{$t('infoQuotientStandby')}</p>

        <Title element="h4" variant="h5" class="mb-2 mt-4">{$t('gender')}</Title>
        <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('accepted')}</Title>
        <p>{$t('infoGenderAccepted')}</p>
        <Title element="h5" variant="h6" class="mt-2 mb-1">{$t('applied')}</Title>
        <p>{$t('infoGenderApplied')}</p>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>

  <div class="sr-only">
    <h3>{$t('infoCategories')}</h3>

    <h4>{$t('accepted')}</h4>
    <h5>{$t('admitted')}</h5>
    <p>{$t('infoAcceptedAdmitted')}</p>
    <h5>{$t('standby')}</h5>
    <p>{@html $t('infoAcceptedStandby')}</p>

    <h4>{$t('applied')}</h4>
    <h5>{$t('firstPriority')}</h5>
    <p>{$t('infoAppliedFirstpriority')}</p>
    <h5>{$t('total')}</h5>
    <p>{$t('infoAppliedTotal')}</p>

    <h4>{$t('quotient')}</h4>
    <h5>{$t('primary')}</h5>
    <p>{$t('infoQuotientPrimary')}</p>
    <h5>{$t('standby')}</h5>
    <p>{$t('infoQuotientStandby')}</p>

    <h4>{$t('gender')}</h4>
    <h5>{$t('accepted')}</h5>
    <p>{$t('infoGenderAccepted')}</p>
    <h5>{$t('applied')}</h5>
    <p>{$t('infoGenderApplied')}</p>
  </div>
</Card.Root>
