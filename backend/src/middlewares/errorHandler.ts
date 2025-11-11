import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from '../interfaces/AppError.js'

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  // Log do erro
  request.log.error(error)

  // Erro customizado da aplicação (AppError)
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    })
  }

  // Erro de validação do Zod
  if (error instanceof ZodError || (error as unknown as { issues?: unknown[] }).issues) {
    const zodError = error as unknown as ZodError
    return reply.code(400).send({
      error: 'Dados inválidos',
      details: zodError.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    })
  }

  // Erro do Prisma
  if (error.code?.startsWith('P')) {
    const prismaErrorMessages: Record<string, { status: number; message: string }> = {
      P2002: { status: 409, message: 'Registro duplicado' },
      P2025: { status: 404, message: 'Registro não encontrado' },
      P2003: { status: 400, message: 'Violação de chave estrangeira' },
    }

    const errorInfo = prismaErrorMessages[error.code] || {
      status: 500,
      message: 'Erro no banco de dados',
    }

    return reply.code(errorInfo.status).send({
      error: errorInfo.message,
      code: error.code,
    })
  }

  // Erro genérico
  const statusCode = error.statusCode || 500
  const message = error.message || 'Erro interno do servidor'

  return reply.code(statusCode).send({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  })
}
