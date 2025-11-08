import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { createAccountController, getAccountById, gethistoryBalanceController, updateAccount } from '../controllers/AccountController.js'

const accountsRoutes: FastifyPluginAsync = fp(async server => {
  server.get('/accounts', async (request, reply) => {
    try {
      const accounts = await server.prisma.account.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return { accounts, message: 'Contas encontradas com sucesso' }
    } catch (error) {
      server.log.error(error)
      reply.code(500).send({ error: 'Erro ao buscar contas' })
    }
  })

  server.get('/accounts/balance/:id', gethistoryBalanceController)
  server.post('/accounts', createAccountController)
  server.put('/accounts/:id', updateAccount)
  server.get('/accounts/:id', getAccountById)

})

export default accountsRoutes
