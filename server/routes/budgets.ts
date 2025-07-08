import { Router } from 'express'
import { PrismaClient } from '../generated/prisma'
import { getPairedId } from '../utils/util'

const budgets = Router()
const prisma = new PrismaClient()

budgets.get('/', async (req, res) => {
	try {
        const userId = req.session.user.id
        const pairId = await getPairedId(userId)
        const budgets = await prisma.budgets.findMany({
            where: { pair_id: pairId }
        })

        res.status(200).json(budgets)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default budgets
