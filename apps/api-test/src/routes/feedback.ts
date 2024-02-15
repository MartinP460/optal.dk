import { FastifyInstance } from 'fastify'

async function routes(fastify: FastifyInstance) {
  fastify.get('/', async (_, response) => {
    return response.send('Hello world!')
  })
}

export default routes
