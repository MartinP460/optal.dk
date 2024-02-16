import { FastifyInstance, FastifySchema } from 'fastify'
import { supabase } from '../utils/supabase'

type FeedbackBody = {
  type: 'bug' | 'feature' | 'other'
  text: 'string'
}

const bodySchema = {
  type: 'object',
  required: ['text', 'type'],
  properties: {
    text: { type: 'string' },
    type: { type: 'string', enum: ['bug', 'feature', 'other'] }
  }
}

const schema: FastifySchema = {
  body: bodySchema
}

async function routes(fastify: FastifyInstance) {
  fastify.get('/', async (_, response) => {
    return response.send('Hello world!')
  })

  fastify.post('/', { schema }, async (request, response) => {
    const body = request.body as FeedbackBody

    const sbResponse = await supabase.from('feedback').insert(body)

    if (sbResponse.error) {
      return response.status(500)
    }

    return response.status(200).send('Guess it worked?')
  })
}

export default routes
