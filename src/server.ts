import 'dotenv/config'
import fastify from 'fastify'
import prismaPlugin from './prisma/prisma.plugin.js'
import accountsRoutes from './routes/accounts.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = fastify()

// Registrar o error handler
app.setErrorHandler(errorHandler)

const start = async () => {
  try {
    await app.register(prismaPlugin)
    await app.register(accountsRoutes)

    const port = Number(process.env.PORT) || 3000
    app.listen({ port, host: '0.0.0.0' }, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
