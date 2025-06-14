<script lang="ts">
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Title from '$lib/components/Title.svelte'
  import Visualization from '$lib/components/Visualization.svelte'
  import InformationAccordion from '$lib/components/InformationAccordion.svelte'
  import { t } from '$lib/i18n/index.svelte'
  import { getPeriodIntervalFromPeriod } from '$lib/utils/chartCategoryHelpers'

  let { data } = $props()
  const { grouping, includedCourses } = data

  let breadcrumbRoutes = $derived([{ text: t(grouping.name), url: grouping.slug }])
  let title = $derived(t('metaTitleEducation', { groupingName: t(grouping.name) }))
  let description = $derived(
    t('metaDescriptionEducation', {
      groupingName: t(grouping.name),
      courseYears: getPeriodIntervalFromPeriod(grouping.period)
    })
  )
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<main class="mt-6 sm:mt-10">
  <Breadcrumb routes={breadcrumbRoutes} />
  <Title element="h1" variant="h2" class="mt-4 mb-2" responsive>{t(grouping.name)}</Title>
  <p class="text-sm font-medium leading-tight mt-4 text-muted-foreground">
    {t('totalNumbersForEducation', { groupingName: t(grouping.name) })}
  </p>

  <Visualization dataCategories={grouping.dataCategories} />

  <InformationAccordion
    descriptionOpts={{
      categoriesToDisplay: ['accepted', 'age', 'applied', 'gender', 'education'],
      type: 'grouping'
    }}
  >
    {#snippet coursesInGrouping()}
      <div>
        <p class="text-sm font-medium leading-tight text-muted-foreground">
          {t('coursesInEducationDescription')}
        </p>
        <ul class="hover:text-muted-foreground transition-colors mt-2">
          {#each includedCourses as course (course.id)}
            <li class="hover:text-primary">
              <a href={`/${course.institution.slug}/${course.slug}`} class="flex flex-col gap-1 py-2">
                <p class="text-sm font-semibold">{course.latestName}</p>
                <p class="text-xs">
                  {[course.institution.latestName, getPeriodIntervalFromPeriod(course.period)]
                    .filter((item) => item)
                    .join(', ')}
                </p>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/snippet}
  </InformationAccordion>
</main>
