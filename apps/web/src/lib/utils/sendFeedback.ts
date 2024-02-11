import { env } from '$env/dynamic/public'
import type { Feedback } from '$lib/types/feedback'

export async function sendFeedback(text: string, type: Feedback) {
  const body = {
    text,
    type,
    url: 'asdasd'
  }

  const response = await fetch(`${env.PUBLIC_API_URL}/feedback`, {
    method: 'POST',
    body: JSON.stringify(body),
    mode: 'cors'
  })

  return { error: !response.ok }
}
