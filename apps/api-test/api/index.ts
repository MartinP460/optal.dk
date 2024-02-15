import app from '../src/index'

export default async function handler(request: Request, response: Response) {
  await app.ready()
  app.server.emit('request', request, response)
}
