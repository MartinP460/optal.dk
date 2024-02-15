import { FastifyInstance } from 'fastify'

async function routes(fastify: FastifyInstance) {
  fastify.get('/feedback', async (_, response) => {
    return response.send('Hello world!')
  })
}

export default routes
