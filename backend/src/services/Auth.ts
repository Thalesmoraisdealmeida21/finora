import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AppError } from "src/interfaces/AppError.js"

export class AuthService {
    private prisma: PrismaClient
    constructor() {
      this.prisma = new PrismaClient()
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            throw new AppError('Any user with this email was found', 401)
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            throw new AppError('Invalid password', 401)
        }   

        const token = jwt.sign({ userId: user.id }, process.env.SECRET || '', { expiresIn: '1d' })

        if (!token) {
            throw new AppError('Error during the login process', 401)
        }

        return token
    }
}   