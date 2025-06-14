<script lang="ts">
  import { IconAdjustments } from '@tabler/icons-svelte'
  import type { KOTDataCategories, KOTDataCategory } from 'reader'
  import * as Popover from '$lib/components/ui/popover'
  import * as Drawer from '$lib/components/ui/drawer'
  import Button from '$lib/components/ui/button/button.svelte'
  import { t } from '$lib/i18n/index.svelte'
  import VisualizationCategorySelectInput from '$lib/components/VisualizationCategorySelectInput.svelte'
  import DotSeperator from '$lib/components/DotSeperator.svelte'
  import { getColorFromCategory } from '$lib/utils/getColorFromDataset'

  type Props = {
    dataCategories: KOTDataCategories
    selectedDataCategory: KOTDataCategory
    onCategorySelect: (value: KOTDataCategory) => void
  }

  let { dataCategories, selectedDataCategory, onCategorySelect }: Props = $props()

  let color = $derived(getColorFromCategory(selectedDataCategory.name))
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet children()}
    <Button variant="outline" class="hidden md:flex h-12 w-42">
      <IconAdjustments class="w-5 h-5 mr-2" stroke={1.75} />
      <div class="text-left">
        <p class="text-xs text-muted-foreground">{t('categories')}</p>
        <span class="inline-flex gap-2 items-center">
          <p>{t(selectedDataCategory.name)}</p>
          <DotSeperator style={`background-color: ${color}`} />
        </span>
      </div>
    </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content align="start" class="flex flex-col w-fit py-2 min-w-44">
    <VisualizationCategorySelectInput {dataCategories} {selectedDataCategory} {onCategorySelect} />
  </Popover.Content>
</Popover.Root>

<Drawer.Root>
  <Drawer.Trigger>
    {#snippet children()}
      <Button variant="outline" class="flex md:hidden h-12 w-42">
        <IconAdjustments class="w-5 h-5 mr-2" stroke={1.75} />
        <div class="text-left">
          <p class="text-xs text-muted-foreground">{t('categories')}</p>
          <span class="inline-flex gap-2">
            <p>{t(selectedDataCategory.name)}</p>
            <DotSeperator style={`background-color: ${color}`} />
          </span>
        </div>
      </Button>
    {/snippet}
  </Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>{t('categories')}</Drawer.Title>
      <Drawer.Description>{t('categoriesSelect')}</Drawer.Description>
    </Drawer.Header>
    <div class="px-6 py-2">
      <VisualizationCategorySelectInput {dataCategories} {selectedDataCategory} {onCategorySelect} />
    </div>
    <Drawer.Footer>
      <Drawer.Close>
        {#snippet children()}
          <Button>{t('seeChanges')}</Button>
        {/snippet}
      </Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
