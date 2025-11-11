import { PrismaClient } from '@prisma/client'
import Account, { BalanceHistory } from 'src/interfaces/account.js'


interface ResumeInfo {
  totalBalance: number
  totalBalanceInDollar: number
  bitcoinQuotation: number
  dollarQuotation: number
  changeInTheLastMonth: number
}
export class AccountService {
  private prisma: PrismaClient
  constructor() {
    this.prisma = new PrismaClient()
  }

  async createAccount(name: string, balance: number = 0, isDollar: boolean = false): Promise<Account> {
    const account = await this.prisma.$transaction(async tx => {
      try {
        const newAccount = await tx.account.create({
          data: { name, balance, isDollar },
        })
        await tx.balance_history.create({
          data: {
            accountId: newAccount.id,
            balance: balance,
            date: new Date(),
          },
        })
        return newAccount
      } catch (error) {
        throw new Error('Error creating new account: ' + error)
      }
    })

    return account as Account
  }

  async gethistoryBalance(accountId: string): Promise<BalanceHistory[]> {
    const historyBalance = await this.prisma.balance_history.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
      include: {
        account: true,
      },
    })
    return historyBalance as BalanceHistory[]
  }

  async getAccountById(id: string): Promise<Account> {
    try {
      const account = await this.prisma.account.findUnique({
        where: { id },
        include: {
          balanceHistory: true,
        },
      })

      if (!account) {
        throw new Error('Account not found')
      }
      return account as Account
    } catch (error) {
      throw new Error(`Error getting account ${id}: ${error}`)
    }
  }

  async updateAccount(
    id: string,
    name: string | undefined,
    balance: number | undefined
  ): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    })
    if (!account) {
      throw new Error('Account not found')
    }
    if (balance && balance > 0 && account.balance !== balance) {
      await this.prisma.balance_history.create({
        data: {
          accountId: id,
          balance: balance,
          date: new Date(),
        },
      })
    }
    await this.prisma.account.update({
      where: { id },
      data: { name, balance },
    })
    return account as Account
  }

  async getResumeInfo(): Promise<ResumeInfo> {
   const totalDollarBalance = await this.prisma.account.aggregate({
    _sum: {
      balance: true,
    },
    where: { isDollar: true },
   })
   const totalReaisBalance = await this.prisma.account.aggregate({
    _sum: {
      balance: true,
    },
    where: { isDollar: false },
   })

   const totalBalance = (totalDollarBalance._sum.balance ?? 0) + (totalReaisBalance._sum.balance ?? 0);

   return {
     totalBalance,
     totalBalanceInDollar: 0,
     bitcoinQuotation: 0,
     dollarQuotation: 0,
     changeInTheLastMonth: 0,
   }
  }
}
