import { Router } from 'express'
import { PrismaClient } from '../generated/prisma'
import { getPairedId } from '../utils/util'

const budgets = Router()
const prisma = new PrismaClient()

budgets.get('/', async (req, res) => {
	try {
        const userId = req.session.id
        const pairId = getPairedId(userId)
        const budgets = await prisma.budgets.findMany({
            where: { pair_id: pairId }
        })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default budgets
