import type { FeedbackType } from '$lib/types/feedback'
import { env } from '$env/dynamic/public'

export async function sendFeedback(text: string, type: FeedbackType) {
  const body = {
    text,
    type
  }

  const response = await fetch(`${env.PUBLIC_API_URL}/feedback`, {
    method: 'POST',
    body: JSON.stringify(body),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return { error: !response.ok }
}
