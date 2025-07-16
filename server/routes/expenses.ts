import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { randomUUID } from 'crypto'
import { connectedClients } from '../websocket/wsStore'
import { getPairedId } from '../utils/util'

const expenses = Router()
const prisma = new PrismaClient()

expenses.post('/', async (req, res) => {
	try {
		const userId = req.session.user.id
		const pairId = await getPairedId(userId)
		const body = req.body
		const newExpense = await prisma.transactions.create({
			data: {
				id: randomUUID(),
				user_id: userId,
				pair_id: pairId,
				account_id: body.accountId,
				category: body.category,
				date: body.date,
				authorized_date: body.authorizedDate,
				name: body.name,
				amount: body.amount,
				currency_code: body.currencyCode,
			},
		})

		connectedClients.forEach((client) => {
			if (client.readyState === 1) {
				client.send(
					JSON.stringify({ type: 'new_expense', content: true })
				)
			}
		})

		res.status(201).json({ message: 'New expense added' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default expenses
