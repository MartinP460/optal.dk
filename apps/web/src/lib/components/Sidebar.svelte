<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import SidebarFeedback from '$lib/components/SidebarFeedback.svelte'
  import SidebarNavigation from '$lib/components/SidebarNavigation.svelte'

  const dispatch = createEventDispatcher()

  type Props = {
    sidebarPage: 'navigation' | 'feedback'
  }

  let { sidebarPage }: Props = $props()
</script>

{#if sidebarPage === 'feedback'}
  <SidebarFeedback on:cancel={() => dispatch('feedbackCancel')} />
{:else if sidebarPage === 'navigation'}
  <SidebarNavigation
    on:close={() => dispatch('close')}
    on:feedbackOpen={() => dispatch('feedbackOpen')}
  />
{/if}
