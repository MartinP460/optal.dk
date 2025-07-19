<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import { t } from '$lib/i18n/index.svelte'

  let breadcrumbRoutes = $derived([{ text: t('about'), url: '/about' }])
</script>

<svelte:head>
  <title>{`${t('about')} • optal.dk`}</title>
  <meta name="description" content={t('metaDescriptionAbout')} />
</svelte:head>

<main class="mt-6 sm:mt-10 mx-auto container px-0 max-w-2xl">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-4 mb-2">
    {t('about')}
  </h1>

  <article class="leading-7 mt-8">
    <h4
      class="scroll-m-20 text-2xl font-semibold tracking-tight my-10 underline underline-offset-8"
    >
      {t('aboutByline')}
    </h4>
    <p>{t('aboutDescription')}</p>
    <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2">
      {t('disclaimer')}
    </h4>
    <p>{t('aboutDisclaimer')}</p>
  </article>
</main>
