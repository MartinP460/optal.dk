import { env } from '$env/dynamic/public'

export async function sendFeedback(text: string) {
  const body = {
    text,
    type: 'other'
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
