<script lang="ts">
  import type { PageData } from './$types'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Meta from '$lib/components/Meta.svelte'
  import Visualization from '$lib/components/Visualization.svelte'

  export let data: PageData

  const breadcrumbRoutes = [
    { text: data.institution.latestName, url: data.institution.slug },
    { text: data.course.latestName, url: data.course.slug }
  ]
</script>

<main class="mt-6 sm:mt-10">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="text-2xl sm:text-3xl mt-4 mb-2">{data.course.latestName}</h1>
  <Meta course={data.course} />

  <Visualization data={data.courseData} labelGroups={data.courseLabelGroups} />
</main>
