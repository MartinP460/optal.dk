import { env } from '$env/dynamic/public'

type Feedback = 'bug' | 'feature'

export async function sendFeedback(text: string, type: Feedback, url: string | null) {
  const body = {
    text,
    type,
    url
  }

  const response = await fetch(`${env.PUBLIC_API_URL}/feedback`, {
    method: 'POST',
    body: JSON.stringify(body),
    mode: 'cors'
  })

  return { error: !response.ok }
}
