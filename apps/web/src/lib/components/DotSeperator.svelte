<script>
  let { class: customClass = '', ...rest } = $props()
</script>

<div class={`bg-gray-400 w-2 h-2 rounded-full self-center ${customClass}`} {...rest}></div>
