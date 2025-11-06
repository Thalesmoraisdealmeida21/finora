import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import routes from './routes/index.js'

const fastify = Fastify({
  logger: true
})

// Rota raiz
fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  return { hello: 'world' }
})

/**
 * Run the server!
 */
const start = async () => {
  try {
    // Registrar rotas como middleware
    await fastify.register(routes)
    
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Server is running on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
  }
}

start()