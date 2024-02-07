export const prerender = false

import type { Actions } from './$types'
import { supabase } from '$lib/server/supabase'

export const actions = {
  default: async () => {
    await supabase
      .from('feedback')
      .insert({ text: 'Hello world!', url: '/feedback', type: 'Feature' })
  }
} satisfies Actions
