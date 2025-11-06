import { FastifyInstance, FastifyPluginOptions } from 'fastify'

async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Rota de exemplo
  fastify.get('/api', async (request, reply) => {
    return { message: 'API is working', timestamp: new Date().toISOString() }
  })

  // Rota de health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', uptime: process.uptime() }
  })
}

export default routes

