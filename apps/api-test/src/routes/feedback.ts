import { FastifyInstance } from 'fastify'

async function routes(fastify: FastifyInstance) {
  fastify.get('/', async (_, response) => {
    return response.send('Hello world!')
  })

  fastify.post('/', async (request, response) => {
    console.log(request.body)

    return response.status(200).send('Guess it worked?')
  })
}

export default routes
