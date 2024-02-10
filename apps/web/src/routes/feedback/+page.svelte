<script>
  import Breadcrumb from '$lib/components/Breadcrumb.svelte'
  import Container from '$lib/components/Container.svelte'
  import Button from '$lib/components/ui/button/button.svelte'
  import { t } from '$lib/i18n'
  import { sendFeedback } from '$lib/utils/sendFeedback'

  $: breadcrumbRoutes = [{ text: $t('feedback'), url: '/about' }]

  const handleClick = async () => {
    await sendFeedback('This works!', 'bug', '/feedback')
  }
</script>

<Container>
  <Breadcrumb routes={breadcrumbRoutes} />
  <h1 class="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-4 mb-2">
    {$t('feedback')}
  </h1>

  <form>
    <Button on:click={handleClick}>Click me</Button>
  </form>
</Container>
