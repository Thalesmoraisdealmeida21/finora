import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

const accountsRoutes: FastifyPluginAsync = fp(async (server) => {
  // GET /accounts - Listar todas as contas
  server.get('/accounts', async (request, reply) => {
    try {
      const accounts = await server.prisma.account.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return accounts
    } catch (error) {
      server.log.error(error)
      reply.code(500).send({ error: 'Erro ao buscar contas' })
    }
  })

  // GET /accounts/:id - Obter uma conta específica
  server.get<{ Params: { id: string } }>('/accounts/:id', async (request, reply) => {
    try {
      const { id } = request.params
      const account = await server.prisma.account.findUnique({
        where: { id }
      })

      if (!account) {
        reply.code(404).send({ error: 'Conta não encontrada' })
        return
      }

      return account
    } catch (error) {
      server.log.error(error)
      reply.code(500).send({ error: 'Erro ao buscar conta' })
    }
  })

  // POST /accounts - Criar uma nova conta
  server.post<{ Body: { name: string; balance?: number } }>('/accounts', async (request, reply) => {
    try {
      const { name, balance = 0 } = request.body

      if (!name) {
        reply.code(400).send({ error: 'Nome é obrigatório' })
        return
      }

      const account = await server.prisma.account.create({
        data: {
          name,
          balance
        }
      })

      reply.code(201).send(account)
    } catch (error) {
      server.log.error(error)
      reply.code(500).send({ error: 'Erro ao criar conta' })
    }
  })

  // PUT /accounts/:id - Atualizar uma conta
  server.put<{ Params: { id: string }; Body: { name?: string; balance?: number } }>(
    '/accounts/:id',
    async (request, reply) => {
      try {
        const { id } = request.params
        const { name, balance } = request.body

        const account = await server.prisma.account.update({
          where: { id },
          data: {
            ...(name && { name }),
            ...(balance !== undefined && { balance })
          }
        })

        return account
      } catch (error) {
        server.log.error(error)
        reply.code(500).send({ error: 'Erro ao atualizar conta' })
      }
    }
  )

  // DELETE /accounts/:id - Deletar uma conta
  server.delete<{ Params: { id: string } }>('/accounts/:id', async (request, reply) => {
    try {
      const { id } = request.params

      await server.prisma.account.delete({
        where: { id }
      })

      reply.code(204).send()
    } catch (error) {
      server.log.error(error)
      reply.code(500).send({ error: 'Erro ao deletar conta' })
    }
  })
})

export default accountsRoutes
