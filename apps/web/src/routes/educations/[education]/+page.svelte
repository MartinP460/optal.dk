<script lang="ts">
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Title from '$lib/components/Title.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import InformationAccordion from '$lib/components/InformationAccordion.svelte'
  import { t } from '$lib/i18n/index.svelte'
  import { CategoryLabel } from '$lib/utils/categories'
  import { getStringFromPeriod } from '$lib/utils/getStringFromPeriod'

  let props = $props()
  const { grouping, data, includedCourses } = $derived(props.data)

  let breadcrumbRoutes = $derived([{ text: t(grouping.name), url: grouping.slug }])
  let title = $derived(t('metaTitleEducation', { groupingName: t(grouping.name) }))
  let description = $derived(
    t('metaDescriptionEducation', {
      groupingName: t(grouping.name),
      courseYears: getStringFromPeriod(grouping.period)
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
  <Title element="h1" variant="h2" class="mt-4 mb-2" responsive>{t(grouping.name)}</Title>
  <p class="text-sm font-medium leading-tight mt-4 text-muted-foreground">
    {t('totalNumbersForEducation', { groupingName: t(grouping.name) })}
  </p>

  <Visualization {data} {categoriesToDisplay} />

  <InformationAccordion {categoriesToDisplay} type="grouping" coursesInGrouping={includedCourses} />
</main>
