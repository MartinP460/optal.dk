<script lang="ts">
  import clsx from 'clsx'

  export let element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  export let variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = element
  let customClass = ''
  export { customClass as class }

  const classNames = {
    h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    h6: 'scroll-m-20 font-semibold tracking-tight'
  }
</script>

<svelte:element this={element} class={clsx(classNames[variant], customClass)}
  ><slot />
</svelte:element>
