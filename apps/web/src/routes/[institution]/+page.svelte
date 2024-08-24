<script lang="ts">
  import { LATEST_YEAR } from 'parser'
  import type { PageData } from './$types'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import { t } from '$lib/i18n'
  import InformationAccordion from '$lib/components/InformationAccordion.svelte'
  import Title from '$lib/components/Title.svelte'
  import { getPeriodIntervalFromPeriod } from '$lib/utils/chartCategoryHelpers'

  export let data: PageData

  const { institution } = data

  const breadcrumbRoutes = [{ text: institution.latestName, url: institution.slug }]
  $: title = $t('metaTitleInstitution', {
    institutionName: institution.latestName,
    institutionYears: getPeriodIntervalFromPeriod(institution.period)
  })
  $: description = $t('metaDescriptionInstitution', {
    institutionName: institution.latestName,
    institutionYears: getPeriodIntervalFromPeriod(institution.period)
  })

  const institutionIsInactive =
    institution.dataCategories.accepted?.datasets.slice(-1)[0].year !== LATEST_YEAR
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
  <Title element="h1" variant="h2" class="mt-4 mb-2" responsive>{institution.latestName}</Title>
  <p class="text-sm font-medium leading-tight mt-4 text-muted-foreground">
    {$t('totalNumbersForInstitution', { institution: institution.latestName })}.
  </p>

  <Visualization dataCategories={institution.dataCategories} />

  <InformationAccordion
    descriptionOpts={{ categoriesToDisplay: ['accepted', 'applied'], type: 'institution' }}
  >
    <svelte:fragment slot="coursesInInstitution">
      <p class="text-sm font-medium leading-tight text-muted-foreground">
        {$t('coursesOffered')}
      </p>
      <ul class="hover:text-muted-foreground transition-colors mt-2">
        {#each institution.courses as course (course.id)}
          <li class="hover:text-primary">
            <a href={`/${institution.slug}/${course.slug}`} class="flex flex-col gap-1 py-2">
              <p class="text-sm font-semibold">{course.latestName}</p>
              <p class="text-xs">
                {[
                  getPeriodIntervalFromPeriod(course.period),
                  course.location,
                  course.studyStart ? $t(course.studyStart) : '',
                  course.eLearning ? 'e-learning' : null
                ]
                  .filter((item) => item)
                  .join(', ')}
              </p>
            </a>
          </li>
        {/each}
      </ul>
    </svelte:fragment>
  </InformationAccordion>
</main>
