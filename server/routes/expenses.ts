import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { randomUUID } from 'crypto'
import { connectedClients } from '../websocket/wsStore'
import { getPairedId, sendWebsocketMessage } from '../utils/util'

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

		sendWebsocketMessage({
			action: 'ADD',
			object: 'expense',
			user_id: userId,
			pair_id: pairId,
			content: `$${body.amount} for ${body.name}`,
		})

		res.status(201).json({ message: 'New expense added' })
	} catch (error) {
		console.error('POST /api/expenses error:', error)
		res.status(500).json({ error: error.message })
	}
})

export default expenses
