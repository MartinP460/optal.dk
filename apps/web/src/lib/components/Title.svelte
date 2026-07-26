<script lang="ts">
  import clsx from 'clsx'

  type Props = {
    element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    responsive?: boolean
    class?: string
    children?: import('svelte').Snippet
  }

  let {
    element,
    variant = element,
    responsive = false,
    class: customClass = '',
    children
  }: Props = $props()

  const classNames = $derived({
    h1: `scroll-m-20 font-bold tracking-tight lg:text-5xl ${responsive ? 'sm:text-4xl text-3xl' : 'text-4xl'}`,
    h2: `scroll-m-20 font-semibold tracking-tight ${responsive ? 'sm:text-3xl text-2xl' : 'text-3xl'}`,
    h3: `scroll-m-20 font-semibold tracking-tight ${responsive ? 'sm:text-2xl text-xl' : 'text-2xl'}`,
    h4: `scroll-m-20 font-semibold tracking-tight ${responsive ? 'sm:text-xl text-lg' : 'text-xl'}`,
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    h6: 'scroll-m-20 font-semibold tracking-tight'
  })
</script>

<svelte:element this={element} class={clsx(classNames[variant], customClass)}
  >{@render children?.()}
</svelte:element>
