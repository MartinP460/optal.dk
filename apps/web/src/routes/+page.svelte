<script lang="ts">
  import { Input } from '$lib/components/ui/input'
  import { Separator } from '$lib/components/ui/separator'
  import * as Card from '$lib/components/ui/card'
  import * as Accordion from '$lib/components/ui/accordion'
  import { convertCourseYearsToString } from '$lib/utils/convertCourseYearsToString'
  import type { PageData } from './$types'
  import Fuse from 'fuse.js'
  import type { KOTInstitution } from 'parser'
  import clsx from 'clsx'
  import { t } from '$lib/i18n'
  import Button from '$lib/components/ui/button/button.svelte'
  import { IconChevronRight } from '@tabler/icons-svelte'

  export let data: PageData

  const { institutions, searchIndexes } = data

  const coursesWithInstitutions = institutions.flatMap((institution) =>
    institution.courses.map((course) => ({
      ...course,
      // we have to generate different id's since KOT does not have unique id's
      id: Math.random().toString(36).substring(2, 9),
      kotId: course.id,
      institution
    }))
  )

  const institutionIndex = Fuse.parseIndex<Required<KOTInstitution>>(searchIndexes.institutionIndex)
  const courseIndex = Fuse.parseIndex<(typeof coursesWithInstitutions)[0]>(
    searchIndexes.courseIndex
  )

  const fuseOptions = {
    threshold: 0.2
  }

  const institutionFuse = new Fuse(institutions, fuseOptions, institutionIndex)
  const courseFuse = new Fuse(coursesWithInstitutions, fuseOptions, courseIndex)

  let searchQuery = ''

  $: instutionsResult = institutionFuse.search(searchQuery).slice(0, 10)
  $: coursesResult = courseFuse.search(searchQuery).slice(0, 25)
</script>

<main class="flex flex-col justify-center items-center">
  <div class="lg:mt-24 mt-12 mb-20 text-center">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      uni<span class="text-red-500">optag</span>.dk
    </h1>
    <p class="font-medium mt-3 md:mt-4">
      {$t('byline')}
    </p>
    <a href="/test.xlsx" download>Download something</a>
  </div>
  <form class="w-full sm:w-[600px] flex items-center space-x-2">
    <Input bind:value={searchQuery} placeholder="Aalborg Universitet, datalogi, medicin..." />
  </form>
  <Card.Root class={clsx('w-full sm:w-[600px] px-6 py-2 mt-8', searchQuery && 'py-4')}>
    {#if searchQuery}
      {#if instutionsResult.length > 0}
        <div>
          <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">{$t('institutions')}</h3>
          <ul class="mt-2 hover:text-gray-500 transition-colors">
            {#each instutionsResult as institution (institution.item.id)}
              <li class="hover:text-primary">
                <a href={`/${institution.item.slug}`} class="flex flex-col gap-1 py-1.5">
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
          <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">{$t('courses')}</h3>
          <ul class="group/container mt-2 hover:text-gray-500 transition-colors">
            {#each coursesResult as course (course.item.id)}
              <li class="group/item hover:text-primary">
                <a
                  href={`/${course.item.institution.slug}/${course.item.slug}`}
                  class="flex justify-between items-center py-2"
                >
                  <div class="flex flex-col gap-1 max-w-[70%]">
                    <p class="text-sm font-semibold">{course.item.latestName}</p>
                    <p class="text-xs">
                      {[
                        convertCourseYearsToString(course.item.years),
                        course.item.location,
                        course.item.studyStart,
                        course.item.eLearning ? 'e-learning' : null
                      ]
                        .filter((item) => item)
                        .join(', ')}
                    </p>
                  </div>
                  <p
                    class="text-xs
                    text-gray-500 text-right
                    group-hover/container:text-gray-400
                    group-hover/item:text-gray-600"
                  >
                    {course.item.institution.latestName}
                  </p>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if !(instutionsResult.length > 0) && !(coursesResult.length > 0)}
        <p class="text-gray-600 text-center">{$t('noResults')}</p>
      {/if}
    {:else}
      <ul>
        {#each institutions as institution (institution.id)}
          <li>
            <Accordion.Root>
              <Accordion.Item value={institution.latestName}>
                <Accordion.Trigger
                  class="text-left text-sm sm:text-base gap-6 data-[state=open]:text-red-500"
                  >{institution.latestName}</Accordion.Trigger
                >
                <Accordion.Content>
                  <div class="sm:ml-4 mt-2">
                    <Button
                      href={`/${institution.slug}`}
                      variant="secondary"
                      class="h-fit w-full"
                      data-sveltekit-preload-data="tap"
                    >
                      <div class="inline-flex flex-col items-start whitespace-break-spaces flex-1">
                        <span class="text-xs text-gray-600">{$t('totalNumbersFor')}</span>
                        <span>{institution.latestName}</span>
                      </div>
                      <IconChevronRight class="w-5 h-5 ml-3" />
                    </Button>
                    <ul class="mt-4 hover:text-gray-500 transition-colors">
                      {#each institution.courses as course (course.id)}
                        <li class="hover:text-primary">
                          <a
                            href={`/${institution.slug}/${course.slug}`}
                            class="flex flex-col gap-1 py-2"
                          >
                            <p class="text-sm font-semibold">{course.latestName}</p>
                            <p class="text-xs">
                              {[
                                convertCourseYearsToString(course.years),
                                course.location,
                                course.studyStart,
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
            </Accordion.Root>
          </li>
        {/each}
      </ul>
    {/if}
  </Card.Root>
</main>
