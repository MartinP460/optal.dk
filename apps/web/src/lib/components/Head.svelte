<script lang="ts">
  import { env } from '$env/dynamic/public'

  const isProduction = process.env.NODE_ENV === 'production'
</script>

<svelte:head>
  <title>Optal.dk • Some stuff</title>
  <meta name="description" content="Random content" />
  <meta name="”robots”" content="”noindex”" />
  {#if isProduction}
    <script
      async
      src={env.PUBLIC_ANALYTICS_URL}
      data-website-id={env.PUBLIC_ANALYTICS_WEBSITE_ID}
    ></script>
  {/if}
</svelte:head>
