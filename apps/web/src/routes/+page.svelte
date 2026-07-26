<script lang="ts">
  import Fuse from 'fuse.js'
  import { IconChevronDown, IconChevronRight } from '@tabler/icons-svelte'
  import Logo from '$lib/components/Logo.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Accordion from '$lib/components/ui/accordion'
  import * as Tabs from '$lib/components/ui/tabs'
  import { Input } from '$lib/components/ui/input'
  import { Separator } from '$lib/components/ui/separator'
  import { t } from '$lib/i18n/index.svelte.js'
  import { createLocalStorageState } from '$lib/utils/createLocalStorageState.svelte'
  import { getStringFromPeriod } from '$lib/utils/getStringFromPeriod.js'
  import { resolve } from '$app/paths'

  let { data } = $props()
  const { institutions, courses, parentGroupings, searchIndexes } = $derived(data)

  const COURSE_RESULTS_LIMIT = 25
  const INSTITUTION_RESULTS_LIMIT = 10

  const { initialValue, sync } = createLocalStorageState('tabsState', 'institutions')
  let tabsState = $state(initialValue)
  let isLoaded = $state(false)
  $effect(() => {
    sync(tabsState)
    isLoaded = true
  })

  const institutionIndex = $derived(
    Fuse.parseIndex<(typeof institutions)[0]>(searchIndexes.institutionIndex)
  )
  const courseIndex = $derived(Fuse.parseIndex<(typeof courses)[0]>(searchIndexes.courseIndex))

  const fuseOptions = {
    threshold: 0.4
  }

  const institutionFuse = $derived(new Fuse(institutions, fuseOptions, institutionIndex))
  const courseFuse = $derived(new Fuse(courses, fuseOptions, courseIndex))

  let searchQuery = $state('')
  let coursePage = $state(COURSE_RESULTS_LIMIT)

  let instutionsResult = $derived(institutionFuse.search(searchQuery))
  let coursesResult = $derived(courseFuse.search(searchQuery))
</script>

<svelte:head>
  <title>{t('metaTitleHome')}</title>
  <meta name="description" content={t('metaDescriptionHome')} />
</svelte:head>

<main>
  <div class="lg:mt-16 mt-12 mb-20 text-center flex flex-col items-center">
    <h1 class="sr-only">optal.dk</h1>
    <Logo />
    <h2 class="sr-only">{t('seoDescriptionHome')}</h2>
    <p class="font-medium mt-3 md:mt-4">
      {t('byline')}
    </p>
  </div>
  <!-- There's some sort of synchronization issue with tabs that means that we have to defer rendering until
   the value from local storage has been loaded. To test, select "Educations" and reload the page. Thanks Svelte 5. -->
  {#if isLoaded}
    <Tabs.Root bind:value={tabsState} class="flex flex-col justify-center items-center">
      <Tabs.List class="w-full sm:w-156.25 h-12">
        <Tabs.Trigger
          value="institutions"
          class="w-full h-full"
          onclick={() => (tabsState = 'institutions')}
        >
          {t('byInstitution')}
        </Tabs.Trigger>
        <Tabs.Trigger
          value="groupings"
          class="w-full h-full"
          onclick={() => (tabsState = 'groupings')}
        >
          {t('byEducation')}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="institutions" class="w-full sm:w-156.25 px-2 sm:px-4 py-6">
        <form class="w-full flex items-center space-x-2 mb-4">
          <Input
            bind:value={searchQuery}
            oninput={() => (coursePage = COURSE_RESULTS_LIMIT)}
            placeholder="Aalborg Universitet, datalogi, medicin..."
            class="h-12"
          />
        </form>
        {#if searchQuery}
          {#if instutionsResult.length > 0}
            <div>
              <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">{t('institutions')}</h3>
              <ul class="mt-2 hover:text-gray-500 transition-colors">
                {#each instutionsResult.slice(0, INSTITUTION_RESULTS_LIMIT) as institution (institution.item.id)}
                  <li class="hover:text-primary">
                    <a
                      href={resolve(`/${institution.item.slug}`)}
                      class="flex flex-col gap-1 py-1.5"
                    >
                      <p class="scroll-m-20">
                        {institution.item.latestName}
                      </p>
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
          {#if instutionsResult.length > 0 && coursesResult.length > 0}
            <Separator class="my-4" />
          {/if}
          {#if coursesResult.length > 0}
            <div>
              <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">{t('courses')}</h3>
              <ul class="group/container mt-2 hover:text-gray-500 transition-colors">
                {#each coursesResult.slice(0, coursePage) as course (course.item.id)}
                  <li class="group/item hover:text-primary">
                    <a
                      href={resolve(`/${course.item.institution.slug}/${course.item.slug}`)}
                      class="flex justify-between items-center py-2"
                    >
                      <div class="flex flex-col gap-1 max-w-[70%]">
                        <p class="text-sm font-semibold">{course.item.latestName}</p>
                        <p class="text-xs">
                          {[
                            getStringFromPeriod(course.item.period),
                            course.item.location,
                            course.item.studyStart ? t(course.item.studyStart) : '',
                            course.item.eLearning ? 'e-learning' : null
                          ]
                            .filter((item) => item)
                            .join(', ')}
                        </p>
                      </div>
                      <p
                        class="text-xs
                          text-gray-500 text-right
                          group-hover/container:text-muted-foreground
                          group-hover/item:text-primary"
                      >
                        {course.item.institution.latestName}
                      </p>
                    </a>
                  </li>
                {/each}
              </ul>
              {#if coursesResult.length - coursePage > 0}
                <Button
                  onclick={() => (coursePage += 25)}
                  variant="ghost"
                  class="w-full mt-2 text-gray-600"
                >
                  <IconChevronDown class="w-5 h-5 mr-2" />
                  {t('showXMore', {
                    number: Math.min(coursesResult.length - coursePage, COURSE_RESULTS_LIMIT)
                  })}
                </Button>
              {/if}
            </div>
          {/if}
          {#if !(instutionsResult.length > 0) && !(coursesResult.length > 0)}
            <p class="text-gray-600 text-center">{t('noResults')}</p>
          {/if}
        {:else}
          <Accordion.Root type="multiple">
            {#each institutions as institution (institution.id)}
              <Accordion.Item value={institution.latestName}>
                <Accordion.Trigger
                  class="text-left text-sm sm:text-base gap-6 data-[state=open]:text-teal-700"
                >
                  {institution.latestName}
                </Accordion.Trigger>
                <Accordion.Content>
                  <div class="sm:mx-3 mt-2">
                    <Button
                      href={`/${institution.slug}`}
                      variant="secondary"
                      class="h-fit w-full"
                      data-sveltekit-preload-data="tap"
                    >
                      <div class="inline-flex flex-col items-start whitespace-break-spaces flex-1">
                        <span class="text-xs text-muted-foreground">{t('totalNumbersFor')}</span>
                        <span>{institution.latestName}</span>
                      </div>
                      <IconChevronRight class="w-5 h-5 ml-3" />
                    </Button>
                    <ul class="mt-4 hover:text-muted-foreground transition-colors">
                      {#each institution.courses as course (course.id)}
                        <li class="hover:text-primary">
                          <a
                            href={resolve(`/${institution.slug}/${course.slug}`)}
                            class="flex flex-col gap-1 py-2"
                          >
                            <p class="text-sm font-semibold">{course.latestName}</p>
                            <p class="text-xs">
                              {[
                                getStringFromPeriod(course.period),
                                course.location,
                                course.studyStart ? t(course.studyStart) : '',
                                course.eLearning ? 'e-learning' : null
                              ]
                                .filter((item) => item)
                                .join(', ')}
                            </p>
                          </a>
                        </li>
                      {/each}
                    </ul>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            {/each}
          </Accordion.Root>
        {/if}
      </Tabs.Content>
      <Tabs.Content value="groupings" class="w-full sm:w-156.25 px-2 sm:px-4">
        <Accordion.Root type="multiple" class="py-2">
          {#each parentGroupings as [name, groupings] (name)}
            <Accordion.Item value={name}>
              <Accordion.Trigger
                class="text-left text-sm sm:text-base data-[state=open]:text-teal-700"
              >
                {t(name)}
              </Accordion.Trigger>
              <Accordion.Content class="sm:mx-3">
                <ul class="hover:text-muted-foreground transition-colors">
                  {#each groupings as grp (grp.id)}
                    <li class="hover:text-primary">
                      <a href={resolve(`/educations/${grp.slug}`)} class="flex flex-col gap-1 py-2">
                        <p class="text-sm font-semibold">{t(grp.name)}</p>
                        <p class="text-xs">
                          {[
                            t('nCourses', { n: grp.courseIds.length }),
                            getStringFromPeriod(grp.period)
                          ]
                            .filter((item) => item)
                            .join(', ')}
                        </p>
                      </a>
                    </li>
                  {/each}
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          {/each}
        </Accordion.Root>
      </Tabs.Content>
    </Tabs.Root>
  {/if}
</main>
