import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, _options) => {
  server.log.info('Initializing Prisma Client...')
  const prisma = new PrismaClient()

  await prisma.$connect()
  server.log.info('Prisma Client connected !')

  // Make Prisma Client available through the fastify server instance: server.prisma
  server.decorate('prisma', prisma)

  server.addHook('onClose', async server => {
    server.log.info('Prisma Client disconnected !')
    await server.prisma.$disconnect()
  })
})

export default prismaPlugin
