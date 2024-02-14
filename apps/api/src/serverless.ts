/* Vercel configuration for deploying in production. */
import Fastify from 'fastify'

import feedbackRoute from './routes/feedback'

const app = Fastify({
  logger: true
})

app.register(feedbackRoute)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  await app.ready()
  app.server.emit('request', req, res)
}
