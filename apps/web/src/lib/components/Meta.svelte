<script lang="ts">
  import type { KOTCourse } from 'parser'
  import { Badge } from '$lib/components/ui/badge'
  import { t } from '$lib/i18n'
  import { convertCourseYearsToString } from '$lib/utils/convertCourseYearsToString'

  export let course: Required<KOTCourse>
</script>

<div class="flex items-center gap-2 mt-4">
  {#if course.location}
    <Badge class="text-xs">{convertCourseYearsToString(course.years)}</Badge>
  {/if}
  {#if course.location}
    <Badge class="text-xs">{course.location}</Badge>
  {/if}
  {#if course.studyStart}
    <Badge>{$t(course.studyStart)}</Badge>
  {/if}
  {#if course.eLearning}
    <Badge>{$t('eLearning')}</Badge>
  {/if}
</div>
