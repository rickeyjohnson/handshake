import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { getPairedId } from '../utils/util'

const goals = Router()
const prisma = new PrismaClient()

goals.get('/', async (req, res) => {
    try {
        const userId = req.session.user.id
        const pairId = await getPairedId(userId)
        const goals = await prisma.goals.findMany({
            where: { pair_id: pairId }
        })

        res.status(200).json(goals)
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
})

export default goals