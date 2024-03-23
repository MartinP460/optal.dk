<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import SidebarFeedback from '$lib/components/SidebarFeedback.svelte'
  import SidebarNavigation from '$lib/components/SidebarNavigation.svelte'

  const dispatch = createEventDispatcher()

  export let sidebarPage: 'navigation' | 'feedback'
</script>

{#if sidebarPage === 'feedback'}
  <SidebarFeedback on:cancel={() => dispatch('feedbackCancel')} />
{:else if sidebarPage === 'navigation'}
  <SidebarNavigation
    on:close={() => dispatch('close')}
    on:feedbackOpen={() => dispatch('feedbackOpen')}
  />
{/if}
