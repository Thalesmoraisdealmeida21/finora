import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { AccountService } from '../services/Account.js'

const accountService = new AccountService()

const createAccountSchema = z.object({
  name: z.string().min(1, 'Please provide a name'),
  balance: z.number().optional().default(0),
  isDollar: z.boolean().optional().default(false),
})

const updateAccountSchema = z.object({
  name: z.string().optional(),
  balance: z.number().optional(),
})

export async function createAccountController(request: FastifyRequest, reply: FastifyReply) {
  const validatedDataAccount = createAccountSchema.parse(request.body)

  const account = await accountService.createAccount(
    validatedDataAccount.name,
    validatedDataAccount.balance,
    validatedDataAccount.isDollar ?? false
  )
  if (!account) {
    return reply.code(500).send({ error: 'Error creating new account' })
  } else {
    return reply.code(201).send(account)
  }
}

export async function gethistoryBalanceController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  // Make sure gethistoryBalance is imported from the correct service file
  // import { gethistoryBalance } from '../services/Account.js'
  const historyBalance = await accountService.gethistoryBalance(id)
  return reply.code(200).send(historyBalance)
}

export async function updateAccount(request: FastifyRequest, reply: FastifyReply) {
  const validateUpdateAccount = updateAccountSchema.parse(request.body)
  const { id } = request.params as { id: string }
  const account = await accountService.updateAccount(
    id,
    validateUpdateAccount.name,
    validateUpdateAccount.balance
  )
  if (!account) {
    return reply.code(500).send({ error: 'Error updating account' })
  } else {
    return reply.code(200).send(account)
  }
}

export async function getAccountById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const account = await accountService.getAccountById(id)
  if (!account) {
    return reply.code(500).send({ error: 'Error getting account' })
  } else {
    return reply.code(200).send(account)
  }
}
