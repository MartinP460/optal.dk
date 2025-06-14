<script lang="ts">
  import SidebarFeedback from '$lib/components/SidebarFeedback.svelte'
  import SidebarNavigation from '$lib/components/SidebarNavigation.svelte'

  type Props = {
    sidebarPage: 'navigation' | 'feedback'
    onClose: () => void
    onFeedbackCancel: () => void
    onFeedbackOpen: () => void
  }

  let { sidebarPage, onClose, onFeedbackCancel, onFeedbackOpen }: Props = $props()
</script>

{#if sidebarPage === 'feedback'}
  <SidebarFeedback onCancel={onFeedbackCancel} />
{:else if sidebarPage === 'navigation'}
  <SidebarNavigation {onClose} {onFeedbackOpen} />
{/if}
