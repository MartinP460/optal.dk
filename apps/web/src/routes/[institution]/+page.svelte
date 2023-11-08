<script lang="ts">
  import type { PageData } from './$types'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import { t } from '$lib/i18n'

  export let data: PageData

  const breadcrumbRoutes = [{ text: data.institution.latestName, url: data.institution.slug }]
</script>

<main class="mt-10 sm:mt-16">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="text-2xl sm:text-3xl mt-4 mb-2">{data.institution.latestName}</h1>
  <p class="text-sm font-medium leading-none mt-4 text-gray-600">
    {$t('totalNumbersForInstitution', { institution: data.institution.latestName })}.
  </p>

  <Visualization data={data.institutionData} labelGroups={data.institutionLabelGroups} />
</main>
