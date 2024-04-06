<script lang="ts">
  import { LATEST_YEAR } from 'parser'
  import type { PageData } from './$types'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import { t } from '$lib/i18n'
  import { convertCourseYearsToString } from '$lib/utils/convertCourseYearsToString'

  export let data: PageData

  const { institution, institutionDataGroups } = data

  const breadcrumbRoutes = [{ text: institution.latestName, url: institution.slug }]
  $: title = $t('metaTitleInstitution', {
    institutionName: institution.latestName,
    institutionYears: convertCourseYearsToString(institution.datasets[0].years)
  })
  $: description = $t('metaDescriptionInstitution', {
    institutionName: institution.latestName,
    institutionYears: convertCourseYearsToString(institution.datasets[0].years)
  })

  const institutionIsInactive = !institution.datasets[0].years.includes(LATEST_YEAR)
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if institutionIsInactive}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<main class="mt-6 sm:mt-10">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="text-2xl sm:text-3xl mt-4 mb-2">{institution.latestName}</h1>
  <p class="text-sm font-medium leading-none mt-4 text-gray-600">
    {$t('totalNumbersForInstitution', { institution: institution.latestName })}.
  </p>

  <Visualization dataGroups={institutionDataGroups} />
</main>
