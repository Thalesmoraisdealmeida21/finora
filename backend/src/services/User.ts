import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'

export class UserService {
    private prisma: PrismaClient
    constructor() {
      this.prisma = new PrismaClient()
    }

    async createUser(name: string | undefined, email: string, password: string) {
        const saltRounds = 15;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const userWithSameEmail = await this.prisma.user.findUnique({
            where: { email }
        })
        if (userWithSameEmail) {
            throw new Error('User with same email already exists')
        }
        const user = await this.prisma.user.create({
            data: { name: name || '', email, password: passwordHash }
        })
        delete (user as any).password
        return user
    }
}