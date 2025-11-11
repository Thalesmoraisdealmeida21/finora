import 'dotenv/config'
import fastify from 'fastify'
import prismaPlugin from './prisma/prisma.plugin.js'
import accountsRoutes from './routes/accounts.js'
import { errorHandler } from './middlewares/errorHandler.js'
import cors from '@fastify/cors'
import userRoutes from './routes/user.js'
import fastifyJwt from '@fastify/jwt'
import { AppError } from './interfaces/AppError.js'

const app = fastify()

// Registrar o error handler
app.setErrorHandler(errorHandler)

const start = async () => {
  try {
    // Registrar CORS antes das rotas
    await app.register(cors, {
      origin: true, // Permite todas as origens (ou especifique ['http://localhost:5173'])
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })

    const jwtSecret = process.env.SECRET || ''
    await app.register(fastifyJwt, {
      secret: jwtSecret,
    })
    
    await app.register(prismaPlugin)
    await app.register(accountsRoutes)
    await app.register(userRoutes)

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
