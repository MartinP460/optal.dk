<script>
  import { IconDownload, IconJson, IconTable } from '@tabler/icons-svelte'
  import { AlertCircle } from 'lucide-svelte'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import * as Alert from '$lib/components/ui/alert'
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Card from '$lib/components/ui/card'
  import * as Tabs from '$lib/components/ui/tabs'
  import { t } from '$lib/i18n'

  $: breadcrumbRoutes = [{ text: $t('data'), url: '/about' }]
</script>

<main class="mt-6 sm:mt-10 mx-auto container px-0 max-w-2xl">
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-4 mb-8">
    {$t('data')}
  </h1>

  <Alert.Root variant="default" class="mt-0.5">
    <AlertCircle class="h-4 w-4 stroke-gray-700" />
    <Alert.Description class="mt-[1px] text-gray-700">
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
          <Card.Description>Download optagelsestal i Excel format.</Card.Description>
        </Card.Header>
        <Card.Content>
          <Button href="/data.xlsx" download><IconDownload class="h-5 mr-2" /> Download</Button>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="json">
      <Card.Root>
        <Card.Header>
          <Card.Title>JSON</Card.Title>
          <Card.Description>Download optagelsestal i JSON format.</Card.Description>
        </Card.Header>
        <Card.Content>
          <Button href="/data.json" download><IconDownload class="h-5 mr-2" /> Download</Button>
        </Card.Content>
      </Card.Root>
    </Tabs.Content>
  </Tabs.Root>
</main>
