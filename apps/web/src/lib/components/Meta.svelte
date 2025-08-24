<script lang="ts">
  import type { NewKOTCourse } from '@optaldk/reader'
  import { Badge } from '$lib/components/ui/badge'
  import { t } from '$lib/i18n/index.svelte'
  import { getStringFromPeriod } from '$lib/utils/getStringFromPeriod'

  type Props = {
    course: NewKOTCourse
  }

  let { course }: Props = $props()
</script>

<div class="flex items-center gap-2 mt-4 flex-wrap">
  {#if course.location}
    <Badge class="text-xs">{getStringFromPeriod(course.period)}</Badge>
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
