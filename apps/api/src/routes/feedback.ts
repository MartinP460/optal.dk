import { FastifyInstance } from 'fastify'

async function routes(fastify: FastifyInstance) {
  fastify.get('/feedback', async (_, response) => {
    return response.send({ hello: 'world' })
  })
}

export default routes
