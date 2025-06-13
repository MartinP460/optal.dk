<script>
  import { IconDownload, IconJson, IconTable } from '@tabler/icons-svelte'
  import { AlertCircle } from 'lucide-svelte'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import * as Alert from '$lib/components/ui/alert'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Card from '$lib/components/ui/card'
  import * as Tabs from '$lib/components/ui/tabs'
  import { t } from '$lib/i18n'

  let breadcrumbRoutes = $derived([{ text: $t('data'), url: '/about' }])
</script>

<svelte:head>
  <title>{`${$t('data')} • optal.dk`}</title>
  <meta name="description" content={$t('metaDescriptionData')} />
</svelte:head>

<main class="mt-6 sm:mt-10 mx-auto container px-0 max-w-2xl">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-4 mb-8">
    {$t('data')}
  </h1>

  <Alert.Root variant="default" class="mt-0.5">
    <AlertCircle class="h-4 w-4 stroke-muted-foreground" />
    <Alert.Description class="mt-[1px] text-muted-foreground">
      {$t('downloadDataOnThisPage')}
    </Alert.Description>
  </Alert.Root>

  <Tabs.Root value="xlsx" class="w-full mt-6">
    <Tabs.List class="grid grid-cols-2 w-full">
      <Tabs.Trigger value="xlsx"><IconTable class="h-4 mr-1 text-gray-600" /> Excel</Tabs.Trigger>
      <Tabs.Trigger value="json"><IconJson class="h-5 mr-2 text-gray-600" /> JSON</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="xlsx">
      <Card.Root>
        <Card.Header>
          <Card.Title>Excel</Card.Title>
          <Card.Description>{$t('downloadInFormat', { format: 'Excel' })}</Card.Description>
        </Card.Header>
        <Card.Content>
          <Button href="/data.xlsx" download
            ><IconDownload class="h-5 mr-2" /> {$t('download')}</Button
          >
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="json">
      <Card.Root>
        <Card.Header>
          <Card.Title>JSON</Card.Title>
          <Card.Description>{$t('downloadInFormat', { format: 'JSON' })}</Card.Description>
        </Card.Header>
        <Card.Content>
          <Button href="/institutions.json" download
            ><IconDownload class="h-5 mr-2" /> {$t('download')}</Button
          >
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</main>
