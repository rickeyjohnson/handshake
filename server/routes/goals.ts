import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'

const goals = Router()
const prisma = new PrismaClient()

export default goals