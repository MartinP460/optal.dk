import * as dotenv from 'dotenv'
import Fastify from 'fastify'

import feedbackRoute from '../src/routes/feedback'

dotenv.config()

const app = Fastify({
  logger: true
})

app.register(feedbackRoute, {
  prefix: '/feedback'
})

app.get('/', async (_, response) => {
  return response.status(200).send('Success!')
})

// eslint-disable-next-line turbo/no-undeclared-env-vars
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
