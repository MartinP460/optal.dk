<script lang="ts">
  import { PUBLIC_ANALYTICS_URL, PUBLIC_ANALYTICS_WEBSITE_ID } from '$env/static/public'

  const isProduction = process.env.NODE_ENV === 'production'
</script>

<svelte:head>
  <meta name="”robots”" content="”noindex”" />
  {#if isProduction}
    <script async src={PUBLIC_ANALYTICS_URL} data-website-id={PUBLIC_ANALYTICS_WEBSITE_ID}></script>
  {/if}
</svelte:head>
