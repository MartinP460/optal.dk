<script lang="ts">
  type Props = {
    class?: string
    style?: string
  }

  let { class: customClass = '', style }: Props = $props()
</script>

<div class={`bg-gray-400 w-2 h-2 rounded-full self-center ${customClass}`} {style}></div>
