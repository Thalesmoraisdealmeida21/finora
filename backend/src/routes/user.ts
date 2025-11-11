import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import {
    createUserController
} from '../controllers/UserController.js'
import { login } from 'src/controllers/AuthController.js'

const userRoutes: FastifyPluginAsync = fp(async server => {
   
    server.post('/users', createUserController)
    server.post('/auth/login', login)
})

export default userRoutes
