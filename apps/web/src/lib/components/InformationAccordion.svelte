<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import _ from 'lodash'
  import type { KOTCourse, KOTInstitution } from '@optaldk/reader'
  import * as Accordion from '$lib/components/ui/accordion'
  import * as Card from '$lib/components/ui/card'
  import Title from '$lib/components/Title.svelte'
  import { t } from '$lib/i18n/index.svelte'
  import { CategoryLabel } from '$lib/utils/categories'
  import { getStringFromPeriod } from '$lib/utils/getStringFromPeriod'

  type Props = {
    type: 'institution' | 'course' | 'grouping'
    categoriesToDisplay: Array<CategoryLabel>
    coursesInInstitution?: (KOTCourse & { institution: Pick<KOTInstitution, 'slug'> })[]
    coursesInGrouping?: (KOTCourse & {
      institution: Pick<KOTInstitution, 'slug' | 'latestName'>
    })[]
    courseHistory?: Pick<KOTInstitution, 'id' | 'latestName' | 'period' | 'slug'>[]
  }

  let { type, categoriesToDisplay, coursesInInstitution, coursesInGrouping, courseHistory }: Props =
    $props()

  const shouldDisplay = (category: CategoryLabel) => categoriesToDisplay.includes(category)

  const i18nType = _.capitalize(type) as 'Institution' | 'Course' | 'Grouping'
</script>

<Card.Root class="w-full max-w-[800px] px-6 py-2 mt-12 mx-auto">
  <Accordion.Root type="multiple" aria-disabled>
    <Accordion.Item value="categories-description">
      <Accordion.Trigger>
        {t(`infoCategories${i18nType}`)}
      </Accordion.Trigger>
      <Accordion.Content>
        {#if shouldDisplay(CategoryLabel.Accepted)}
          <Title element="h4" variant="h5" class="mb-2 flex gap-4"
            >{t('accepted')}
            <div class="bg-lime-700 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('admitted')}</Title>
          <p>
            {t(`infoAcceptedAdmitted${i18nType}`)}
          </p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('standby')}</Title>
          <p
            class="prose-a:underline prose-a:underline-offset-2 prose-a:decoration-emerald-500 hover:prose-a:text-emerald-600 prose-a:transition-colors"
          >
            {@html t(`infoAcceptedStandby${i18nType}`)}
          </p>
        {/if}

        {#if shouldDisplay(CategoryLabel.Applied)}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('applied')}
            <div class="bg-yellow-700 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('firstPriority')}</Title>
          <p>{t(`infoAppliedFirstpriority${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('total')}</Title>
          <p>{t(`infoAppliedTotal${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay(CategoryLabel.Quotient)}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('quotient')}
            <div class="bg-rose-800 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('primary')}</Title>
          <p>{t(`infoQuotientPrimary${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('standby')}</Title>
          <p>{t(`infoQuotientStandby${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay(CategoryLabel.Quotient)}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('gender')}
            <div class="bg-fuchsia-400 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('accepted')}</Title>
          <p>{t(`infoGenderAccepted${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('applied')}</Title>
          <p>{t(`infoGenderApplied${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay(CategoryLabel.Age)}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('age')}
            <div class="bg-purple-500 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('accepted')}</Title>
          <p>{t(`infoAgeAccepted${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('applied')}</Title>
          <p>{t(`infoAgeApplied${i18nType}`)}</p>
        {/if}

        {#if shouldDisplay(CategoryLabel.Education)}
          <Title element="h4" variant="h5" class="mb-2 mt-4 flex gap-4"
            >{t('education')}
            <div class="bg-amber-800 w-2 h-2 rounded-[3px] self-center"></div></Title
          >
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('accepted')}</Title>
          <p>{t(`infoEducationAccepted${i18nType}`)}</p>
          <Title element="h5" variant="h6" class="mt-2 mb-1">{t('applied')}</Title>
          <p>{t(`infoEducationApplied${i18nType}`)}</p>
        {/if}
      </Accordion.Content>
    </Accordion.Item>
    {#if coursesInInstitution}
      <Accordion.Item value="courses">
        <Accordion.Trigger>
          {t('courses')}
        </Accordion.Trigger>
        <Accordion.Content>
          <p class="text-sm font-medium leading-tight text-muted-foreground">
            {t('coursesOffered')}
          </p>
          <ul class="hover:text-muted-foreground transition-colors mt-2">
            {#each coursesInInstitution as course (course.id)}
              <li class="hover:text-primary">
                <a
                  href={`/${course.institution.slug}/${course.slug}`}
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
        </Accordion.Content>
      </Accordion.Item>
    {/if}
    {#if coursesInGrouping}
      <Accordion.Item value="courses">
        <Accordion.Trigger>
          {t('coursesInEducation')}
        </Accordion.Trigger>
        <Accordion.Content>
          <p class="text-sm font-medium leading-tight text-muted-foreground">
            {t('coursesInEducationDescription')}
          </p>
          <ul class="hover:text-muted-foreground transition-colors mt-2">
            {#each coursesInGrouping as course (course.id)}
              <li class="hover:text-primary">
                <a
                  href={`/${course.institution.slug}/${course.slug}`}
                  class="flex flex-col gap-1 py-2"
                >
                  <p class="text-sm font-semibold">{course.latestName}</p>
                  <p class="text-xs">
                    {[course.institution.latestName, getStringFromPeriod(course.period)]
                      .filter((item) => item)
                      .join(', ')}
                  </p>
                </a>
              </li>
            {/each}
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    {/if}
    {#if courseHistory && courseHistory.length > 1}
      <Accordion.Item value="courseHistory">
        <Accordion.Trigger>
          {t('courseHistory')}
        </Accordion.Trigger>
        <Accordion.Content>
          <p class="text-sm font-medium leading-tight text-muted-foreground">
            {t('courseHistoryDescription')}
          </p>
          <ul class="transition-colors mt-2">
            {#each courseHistory as institution (institution.id)}
              <li class="sm:grid sm:grid-cols-6 gap-4 py-2">
                <p class="text-sm font-semibold text-muted-foreground">
                  {getStringFromPeriod(institution.period)}
                </p>
                <a
                  href={`/${institution.slug}`}
                  class="col-span-5 hover:text-muted-foreground hover:text-primary"
                >
                  <p class="text-sm font-semibold mt-1 sm:mt-0">{institution.latestName}</p>
                </a>
              </li>
            {/each}
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    {/if}
  </Accordion.Root>
</Card.Root>
