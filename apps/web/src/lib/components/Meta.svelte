<script lang="ts">
  import type { KOTCourse } from 'reader'
  import { Badge } from '$lib/components/ui/badge'
  import { t } from '$lib/i18n/index.svelte'
  import { getPeriodIntervalFromPeriod } from '$lib/utils/chartCategoryHelpers'

  type Props = {
    course: KOTCourse
  }

  let { course }: Props = $props()
</script>

<div class="flex items-center gap-2 mt-4 flex-wrap">
  {#if course.location}
    <Badge class="text-xs">{getPeriodIntervalFromPeriod(course.period)}</Badge>
  {/if}
  {#if course.location}
    <Badge class="text-xs">{course.location}</Badge>
  {/if}
  {#if course.studyStart}
    <Badge class="capitalize">{t(course.studyStart)}</Badge>
  {/if}
  {#if course.eLearning}
    <Badge>{t('eLearning')}</Badge>
  {/if}
</div>
