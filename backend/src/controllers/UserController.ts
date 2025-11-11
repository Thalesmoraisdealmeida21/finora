import { FastifyReply, FastifyRequest } from "fastify"
import { UserService } from "src/services/User.js"
import { z } from "zod"


const userService = new UserService()

const createUserSchema = z.object({
    name: z.string().optional(),
    email: z.email('Please provide a valid email'),
    password: z.string(),
  })

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
    const validatedDataUser = createUserSchema.parse(request.body)
    const user = await userService.createUser(validatedDataUser.name, validatedDataUser.email, validatedDataUser.password)
    
    return reply.code(201).send(user)
}