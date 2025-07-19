import cors from '@fastify/cors'
import * as dotenv from 'dotenv'
import Fastify from 'fastify'

import feedbackRoute from './routes/feedback'

dotenv.config()

const app = Fastify({
  logger: process.env.NODE_ENV === 'production'
})

const allowedOrigins = process.env.OPTAL_WEB_DOMAIN ? [process.env.OPTAL_WEB_DOMAIN] : []

app.register(cors, {
  origin: allowedOrigins
})

app.register(feedbackRoute, {
  prefix: '/feedback'
})

app.get('/', async (_, response) => {
  return response.status(200).send('Success!')
})

if (process.env.NODE_ENV === 'development') {
  app.listen({ port: 3000 }, function (err, address) {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    console.log(`Server is now listening on ${address}`)
  })
}

export default app
