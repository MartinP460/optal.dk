<script lang="ts">
  import { IconChevronLeft, IconChevronRight } from '@tabler/icons-svelte'
  import { t } from '$lib/i18n'

  export let routes: { text: string; url: string }[]

  $: routesWithHome = [{ text: $t('home'), url: '' }, ...routes]
</script>

<nav>
  <a
    href={`/${routesWithHome[routesWithHome.length - 2].url}`}
    class="text-gray-600 md:text-sm hover:underline hover:text-black decoration-gray-400 flex items-center md:hidden"
    data-sveltekit-preload-data="tap"
    ><IconChevronLeft size={16} class="mr-1.5" />{routesWithHome[routesWithHome.length - 2].text}
  </a>
  <ul class="hidden md:flex items-center">
    {#each routesWithHome as route, index (route.url)}
      <li>
        {#if index !== routesWithHome.length - 1}
          <a
            href={`/${route.url}`}
            class="text-gray-600 md:text-sm hover:underline hover:text-black decoration-gray-400 flex items-center"
            data-sveltekit-preload-data="tap"
            >{route.text}
            <IconChevronRight size={16} class="mx-2" />
          </a>
        {:else}
          <span class="text-gray-600 text-sm flex items-center">{route.text}</span>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
