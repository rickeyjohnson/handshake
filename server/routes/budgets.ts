import { Router } from 'express'
import { PrismaClient } from '../generated/prisma'

const budgets = Router()
const prisma = new PrismaClient()

export default budgets