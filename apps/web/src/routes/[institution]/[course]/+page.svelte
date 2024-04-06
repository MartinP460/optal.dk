<script lang="ts">
  import { LATEST_YEAR } from 'parser'
  import type { PageData } from './$types'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Meta from '$lib/components/Meta.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import { t } from '$lib/i18n'
  import { convertCourseYearsToString } from '$lib/utils/convertCourseYearsToString'

  export let data: PageData

  const { course, courseDataGroups, institution } = data

  const breadcrumbRoutes = [
    { text: data.institution.latestName, url: data.institution.slug },
    { text: data.course.latestName, url: data.course.slug }
  ]
  $: title = $t('metaTitleCourse', {
    courseName: course.latestName,
    institutionName: institution.latestName,
    courseYears: convertCourseYearsToString(course.datasets[0].years)
  })
  $: description = $t('metaDescriptionCourse', {
    courseName: course.latestName,
    institutionName: institution.latestName,
    courseYears: convertCourseYearsToString(course.datasets[0].years)
  })

  const courseIsInactive = !course.datasets[0].years.includes(LATEST_YEAR)
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
  <h1 class="text-2xl sm:text-3xl mt-4 mb-2">{data.course.latestName}</h1>
  <Meta course={data.course} />

  <Visualization dataGroups={courseDataGroups} />
</main>
