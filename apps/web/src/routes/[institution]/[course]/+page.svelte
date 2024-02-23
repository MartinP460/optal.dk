<script lang="ts">
  import type { PageData } from './$types'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Meta from '$lib/components/Meta.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import { convertCourseYearsToString } from '$lib/utils/convertCourseYearsToString'
  import { t } from '$lib/i18n'

  export let data: PageData

  const { course, courseData, courseLabelGroups, institution } = data

  const breadcrumbRoutes = [
    { text: data.institution.latestName, url: data.institution.slug },
    { text: data.course.latestName, url: data.course.slug }
  ]
  $: title = $t('metaTitleCourse', {
    courseName: course.latestName,
    institutionName: institution.latestName,
    courseYears: convertCourseYearsToString(course.years)
  })
  $: description = $t('metaDescriptionCourse', {
    courseName: course.latestName,
    institutionName: institution.latestName,
    courseYears: convertCourseYearsToString(course.years)
  })
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<main class="mt-6 sm:mt-10">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="text-2xl sm:text-3xl mt-4 mb-2">{data.course.latestName}</h1>
  <Meta course={data.course} />

  <Visualization data={courseData} labelGroups={courseLabelGroups} />
</main>
