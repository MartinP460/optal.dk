<script>
  /* eslint-disable svelte/no-at-html-tags */
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import * as Accordion from '$lib/components/ui/accordion'
  import { t } from '$lib/i18n/index.svelte'

  let QUESTIONS = $derived([
    {
      id: '5',
      question: t('faqQuestion5'),
      answer: t('faqAnswer5')
    },
    {
      id: '1',
      question: t('faqQuestion1'),
      answer: t('faqAnswer1')
    },
    {
      id: '2',
      question: t('faqQuestion2'),
      answer: t('faqAnswer2')
    },
    {
      id: '3',
      question: t('faqQuestion3'),
      answer: t('faqAnswer3')
    },
    {
      id: '4',
      question: t('faqQuestion4'),
      answer: t('faqAnswer4')
    }
  ])

  let breadcrumbRoutes = $derived([{ text: t('faq'), url: '/faq' }])
</script>

<svelte:head>
  <title>{`${t('faq')} • optal.dk`}</title>
  <meta name="description" content={t('metaDescriptionData')} />
</svelte:head>

<main class="mt-6 sm:mt-10 mx-auto container px-0 max-w-2xl">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-4 mb-8">
    {t('faq')}
  </h1>

  <Accordion.Root type="multiple">
    {#each QUESTIONS as question (question.id)}
      <Accordion.Item value={question.id}>
        <Accordion.Trigger
          class="text:lg sm:text-xl text-left py-6 data-[state=open]:text-teal-700 gap-8"
          >{question.question}</Accordion.Trigger
        >
        <Accordion.Content
          class="prose-a:underline prose-a:underline-offset-2 prose-a:decoration-emerald-500 hover:prose-a:text-emerald-600 prose-a:transition-colors text-base pb-4"
          >{@html question.answer}</Accordion.Content
        >
      </Accordion.Item>
    {/each}
  </Accordion.Root>
</main>
