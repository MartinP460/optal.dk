<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import _ from 'lodash'
  import { IconDownload, IconJson, IconTable } from '@tabler/icons-svelte'
  import { LOCALES } from '@optaldk/i18n'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Card from '$lib/components/ui/card'
  import * as Tabs from '$lib/components/ui/tabs'
  import { locale, t } from '$lib/i18n/index.svelte'
  import Title from '$lib/components/Title.svelte'
  import * as RadioGroup from '$lib/components/ui/radio-group'
  import { Label } from '$lib/components/ui/label'
  import { convertLocaleToDisplayString } from '$lib/utils/convertLocaleToDisplayString'

  let breadcrumbRoutes = $derived([{ text: t('data'), url: '/about' }])

  const typesOfData = ['courses', 'institutions', 'educations'] as const

  let typeOfData = $state(typesOfData[0])
  let language = $state(locale.value)

  let filename = $derived(`${typeOfData}${_.upperCase(language)}.xlsx`)
</script>

<svelte:head>
  <title>{`${t('data')} • optal.dk`}</title>
  <meta name="description" content={t('metaDescriptionData')} />
</svelte:head>

<main class="mt-6 sm:mt-10 mx-auto container px-0 max-w-2xl">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-4 mb-8">
    {t('data')}
  </h1>

  <Tabs.Root value="xlsx" class="w-full mt-6">
    <Tabs.List class="grid grid-cols-2 w-full">
      <Tabs.Trigger value="xlsx"><IconTable class="h-4 mr-1 text-gray-600" /> Excel</Tabs.Trigger>
      <Tabs.Trigger value="json"><IconJson class="h-5 mr-2 text-gray-600" /> JSON</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="xlsx">
      <Card.Root>
        <Card.Header>
          <Card.Title>Excel</Card.Title>
          <Card.Description>{t('downloadInFormat', { format: 'Excel' })}</Card.Description>
        </Card.Header>
        <Card.Content>
          <div class="flex justify-between">
            <div class="flex-1">
              <Title element="h4">{t('typeOfData')}</Title>
              <RadioGroup.Root bind:value={typeOfData} class="mt-2 gap-3">
                {#each typesOfData as typeOfData (typeOfData)}
                  <div class="flex items-center space-x-2">
                    <RadioGroup.Item value={typeOfData} id={typeOfData} />
                    <Label for={typeOfData}>{t(typeOfData)}</Label>
                  </div>
                {/each}
              </RadioGroup.Root>
            </div>
            <div class="flex-1">
              <Title element="h4">{t('language')}</Title>
              <RadioGroup.Root bind:value={language} class="mt-2 gap-3">
                {#each LOCALES as locale (locale)}
                  <div class="flex items-center space-x-2">
                    <RadioGroup.Item value={locale} id={locale} />
                    <Label for={locale}>{convertLocaleToDisplayString(locale)}</Label>
                  </div>
                {/each}
              </RadioGroup.Root>
            </div>
          </div>

          <Button href="/data/xlsx/{filename}" download class="mt-6">
            <IconDownload class="h-5 mr-2" />
            {t('download')}
          </Button>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="json">
      <Card.Root>
        <Card.Header>
          <Card.Title>JSON</Card.Title>
          <Card.Description
            class="prose-a:underline prose-a:underline-offset-2 prose-a:decoration-emerald-500 hover:prose-a:text-emerald-600 prose-a:transition-colors"
          >
            {@html t('downloadInJSONFormat')}
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Button href="/data/json/data.json" download>
            <IconDownload class="h-5 mr-2" />
            {t('download')}
          </Button>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</main>
