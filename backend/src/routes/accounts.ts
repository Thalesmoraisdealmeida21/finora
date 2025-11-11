import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import {
  createAccountController,
  getAccountById,
  gethistoryBalanceController,
  updateAccount,
} from '../controllers/AccountController.js'
import { verifyJwt } from '../middlewares/authentication.js'

const accountsRoutes: FastifyPluginAsync = fp(async server => {
  server.get('/accounts', { preHandler: verifyJwt }, async (request, reply) => {
    try {
      const accounts = await server.prisma.account.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return accounts
    } catch (error) {
      server.log.error(error)
      reply.code(500).send({ error: 'Erro ao buscar contas' })
    }
  })

  server.get('/accounts/balance/:id', { preHandler: verifyJwt }, gethistoryBalanceController)
  server.post('/accounts', { preHandler: verifyJwt }, createAccountController)
  server.put('/accounts/:id', { preHandler: verifyJwt }, updateAccount)
  server.get('/accounts/:id', { preHandler: verifyJwt }, getAccountById)
})

export default accountsRoutes
