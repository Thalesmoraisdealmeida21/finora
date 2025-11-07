import fastify from 'fastify'
import prismaPlugin from './prisma/prisma.plugin'
import accountsRoutes from './routes/accounts.js'

const app = fastify()

app.get('/', async (request, reply) => {
  return { hello: 'world' }
})

const start = async () => {
  try {
    // Registrar o plugin do Prisma antes de iniciar o servidor
    await app.register(prismaPlugin)
    
    // Registrar as rotas de accounts
    await app.register(accountsRoutes)
    
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Server is running on http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
