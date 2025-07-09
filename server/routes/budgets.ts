import { Router } from 'express'
import { PrismaClient } from '../generated/prisma'
import { getPairedId, getSpendingOnCategory } from '../utils/util'

const budgets = Router()
const prisma = new PrismaClient()

budgets.get('/', async (req, res) => {
	try {
		const userId = req.session.user.id
		const pairId = await getPairedId(userId)
		const now = new Date()

		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
		const startOfNextMonth = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			1
		)

		const budgets = await prisma.budgets.findMany({
			where: {
				pair_id: pairId,
				created_at: {
					gte: startOfMonth,
					lt: startOfNextMonth,
				},
			},
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
				actual: await getSpendingOnCategory(category, pairId),
			},
		})

		res.status(200).json({ message: `Budget created for ${category}` })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default budgets
