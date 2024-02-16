import app from '../src'

export default async function handler(request: Request, response: Response) {
  await app.ready()
  app.server.emit('request', request, response)
}
