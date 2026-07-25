<script lang="ts">
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import { t } from '$lib/i18n/index.svelte'
  import InformationAccordion from '$lib/components/InformationAccordion.svelte'
  import Title from '$lib/components/Title.svelte'
  import { CategoryLabel } from '$lib/utils/categories'
  import { getStringFromPeriod } from '$lib/utils/getStringFromPeriod'

  let props = $props()

  const { institution, courses, data } = $derived(props.data)

  const breadcrumbRoutes = $derived([{ text: institution.latestName, url: institution.slug }])
  let title = $derived(
    t('metaTitleInstitution', {
      institutionName: institution.latestName,
      institutionYears: getStringFromPeriod(institution.period)
    })
  )
  let description = $derived(
    t('metaDescriptionInstitution', {
      institutionName: institution.latestName,
      institutionYears: getStringFromPeriod(institution.period)
    })
  )

  const categoriesToDisplay = [
    CategoryLabel.Accepted,
    CategoryLabel.Applied,
    CategoryLabel.Gender,
    CategoryLabel.Age,
    CategoryLabel.Education
  ]
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="mt-6 sm:mt-10">
  <Breadcrumb routes={breadcrumbRoutes} />
  <Title element="h1" variant="h2" class="mt-4 mb-2" responsive>{institution.latestName}</Title>
  <p class="text-sm font-medium leading-tight mt-4 text-muted-foreground">
    {t('totalNumbersForInstitution', { institution: institution.latestName })}.
  </p>

  <Visualization {data} {categoriesToDisplay} />

  <InformationAccordion {categoriesToDisplay} type="institution" coursesInInstitution={courses} />
</main>
