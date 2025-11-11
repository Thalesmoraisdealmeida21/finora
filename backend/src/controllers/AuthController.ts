import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "src/services/Auth.js";


const authService = new AuthService()

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string, password: string }

  const token = await authService.login(email, password)
  return reply.code(200).send({ message: 'Login successful', token })
}