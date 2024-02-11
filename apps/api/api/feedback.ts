import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_ANON_KEY ?? ''
)

type FeedbackType = 'bug' | 'feature' | 'other'
const feedbackTypes: FeedbackType[] = ['bug', 'feature', 'other']

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.text || !feedbackTypes.includes(body.type)) {
    return new Response(null, {
      status: 400
    })
  }

  const response = await supabase.from('feedback').insert(body)

  if (response.error) {
    console.error(response.error)
  }

  return new Response(null, {
    status: 200
  })
}
