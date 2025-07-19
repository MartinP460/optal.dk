<script lang="ts">
  import { IconChevronLeft, IconChevronRight } from '@tabler/icons-svelte'
  import { t } from '$lib/i18n/index.svelte'

  type Props = {
    routes: { text: string; url: string }[]
  }

  let { routes }: Props = $props()

  let routesWithHome = $derived([{ text: t('home'), url: '' }, ...routes])
</script>

<nav>
  <a
    href={`/${routesWithHome[routesWithHome.length - 2].url}`}
    class="text-muted-foreground md:text-sm hover:text-primary flex items-center md:hidden transition-colors"
    data-sveltekit-preload-data="tap"
    ><IconChevronLeft size={14} class="mr-1.5" />{routesWithHome[routesWithHome.length - 2].text}
  </a>
  <ul class="hidden md:flex items-center">
    {#each routesWithHome as route, index (route.url)}
      <li class="text-muted-foreground md:text-sm flex items-center">
        {#if index !== routesWithHome.length - 1}
          <a
            href={`/${route.url}`}
            class="hover:text-primary transition-colors"
            data-sveltekit-preload-data="tap"
            >{route.text}
          </a>
          <IconChevronRight size={14} class="mx-2" />
        {:else}
          <span class="text-muted-foreground text-sm flex items-center">{route.text}</span>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
