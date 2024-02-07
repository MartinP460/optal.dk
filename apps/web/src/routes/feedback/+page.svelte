<script>
  import { enhance } from '$app/forms'
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Container from '$lib/components/Container.svelte'
  import { t } from '$lib/i18n'

  $: breadcrumbRoutes = [{ text: $t('feedback'), url: '/about' }]
</script>

<Container>
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-4 mb-2">
    {$t('feedback')}
  </h1>

  <form method="POST" use:enhance>
    <button>ASDSDASDAS</button>
  </form>
</Container>
