<script>
  import { IconHome } from '@tabler/icons-svelte'
  import Container from '$lib/components/Container.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import { t } from '$lib/i18n/index.svelte'
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
</svelte:head>

<Container>
  <div class="flex flex-col items-center mt-24">
    <h1 class="scroll-m-20 text-8xl font-bold tracking-tight">404</h1>
    <p class="font-medium mt-4">
      {t('pageNotFound')}
    </p>
    <Button href="/" variant="outline" class="mt-6">
      <IconHome class="h-5 mr-1 text-muted-foreground" />
      {t('home')}
    </Button>
  </div>
</Container>
