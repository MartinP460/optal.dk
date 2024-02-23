<script lang="ts">
  import type { PageData } from './$types'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import { t } from '$lib/i18n'
  import { convertCourseYearsToString } from '$lib/utils/convertCourseYearsToString'

  export let data: PageData

  const { institution, institutionData, institutionLabelGroups } = data

  const breadcrumbRoutes = [{ text: institution.latestName, url: institution.slug }]
  $: title = $t('metaTitleInstitution', {
    institutionName: institution.latestName,
    institutionYears: convertCourseYearsToString(institution.years)
  })
  $: description = $t('metaDescriptionInstitution', {
    institutionName: institution.latestName,
    institutionYears: convertCourseYearsToString(institution.years)
  })
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<main class="mt-6 sm:mt-10">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="text-2xl sm:text-3xl mt-4 mb-2">{institution.latestName}</h1>
  <p class="text-sm font-medium leading-none mt-4 text-gray-600">
    {$t('totalNumbersForInstitution', { institution: institution.latestName })}.
  </p>

  <Visualization data={institutionData} labelGroups={institutionLabelGroups} />
</main>
