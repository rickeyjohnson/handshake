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

budgets.post('/', async (req, res) => {
	try {
        const { category, budgeted } = req.body
        const userId = req.session.user.id
        const pairId = await getPairedId(userId)
        const newBudget = await prisma.budgets.create({
            data: {
                pair_id: pairId,
                category: category,
                budgeted: budgeted,
                actual: await getSpendingOnCategory(category)
            }
        })

        res.status(200).json({message: `Budget created for ${category}`})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default budgets
