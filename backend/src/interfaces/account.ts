export interface Account {
  id: string
  name: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export interface BalanceHistory {
  id: string
  date: Date
  balance: number
  accountId: string
  account: Account
  createdAt: Date
  updatedAt: Date
}

export default Account
