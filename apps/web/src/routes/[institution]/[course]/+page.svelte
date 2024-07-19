<script lang="ts">
  import { LATEST_YEAR } from 'parser'
  import type { PageData } from './$types'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Meta from '$lib/components/Meta.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import { t } from '$lib/i18n'
  import { convertCourseYearsToString } from '$lib/utils/convertCourseYearsToString'
  import InformationAccordion from '$lib/components/InformationAccordion.svelte'

  export let data: PageData

  const { course, institution } = data

  const breadcrumbRoutes = [
    { text: institution.latestName, url: institution.slug },
    { text: course.latestName, url: course.slug }
  ]
  $: title = $t('metaTitleCourse', {
    courseName: course.latestName,
    institutionName: institution.latestName,
    courseYears: convertCourseYearsToString(course.dataCategories)
  })
  $: description = $t('metaDescriptionCourse', {
    courseName: course.latestName,
    institutionName: institution.latestName,
    courseYears: convertCourseYearsToString(course.dataCategories)
  })

  const courseIsInactive =
    course.dataCategories.accepted?.datasets.slice(-1)[0].year !== LATEST_YEAR
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if courseIsInactive}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<main class="mt-6 sm:mt-10">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="text-2xl sm:text-3xl mt-4 mb-2">{course.latestName}</h1>
  <h2 class="sr-only">
    {$t('seoDescriptionCourse', {
      courseName: course.latestName,
      institutionName: institution.latestName
    })}
  </h2>
  <Meta {course} />

  <Visualization dataCategories={course.dataCategories} />

  <InformationAccordion
    descriptionOpts={{
      categoriesToDisplay: ['accepted', 'applied', 'quotient', 'gender'],
      type: 'course'
    }}
  />
</main>
