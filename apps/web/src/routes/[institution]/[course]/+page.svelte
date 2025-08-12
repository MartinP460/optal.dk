<script lang="ts">
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Meta from '$lib/components/Meta.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import { t } from '$lib/i18n/index.svelte'
  import InformationAccordion from '$lib/components/InformationAccordion.svelte'
  import Title from '$lib/components/Title.svelte'
  import { getPeriodIntervalFromPeriod } from '$lib/utils/chartCategoryHelpers'

  let { data } = $props()

  const { course, institution } = data

  const breadcrumbRoutes = [
    { text: institution.latestName, url: institution.slug },
    { text: course.latestName, url: course.slug }
  ]
  let title = $derived(
    t('metaTitleCourse', {
      courseName: course.latestName,
      institutionName: institution.latestName,
      courseYears: getPeriodIntervalFromPeriod(course.period)
    })
  )
  let description = $derived(
    t('metaDescriptionCourse', {
      courseName: course.latestName,
      institutionName: institution.latestName,
      courseYears: getPeriodIntervalFromPeriod(course.period)
    })
  )
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="mt-6 sm:mt-10">
  <Breadcrumb routes={breadcrumbRoutes} />
  <Title element="h1" variant="h2" class="mt-4 mb-2" responsive>{course.latestName}</Title>
  <h2 class="sr-only">
    {t('seoDescriptionCourse', {
      courseName: course.latestName,
      institutionName: institution.latestName
    })}
  </h2>
  <Meta {course} />

  <Visualization dataCategories={course.dataCategories} />

  <InformationAccordion
    descriptionOpts={{
      categoriesToDisplay: ['accepted', 'applied', 'quotient', 'gender', 'age', 'education'],
      type: 'course'
    }}
  />
</main>
