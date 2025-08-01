import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { randomUUID } from 'crypto'
import { connectedClients } from '../websocket/wsStore'
import {
	getPairedId,
	isAuthenticated,
	sendWebsocketMessage,
} from '../utils/util'

const expenses = Router()
export const prisma = new PrismaClient()

expenses.post('/', isAuthenticated, async (req, res) => {
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

expenses.post('/update', isAuthenticated, async (req, res) => {
	try {
		const userId = req.session.user.id
		const pair_id = await getPairedId(userId)
		console.log(userId, pair_id)
		const body = req.body

		const data = await prisma.transactions.findUnique({
			where: { id: body.id },
			select: {
				update_counter: true,
			},
		})

		console.log('UPDATECOUNTER', data.update_counter, body.update_counter)

		if (data.update_counter === body.update_counter) {
			const updatedExpense = await prisma.transactions.update({
				where: { id: body.id },
				data: {
					user_id: userId,
					account_id: body.account_id,
					category: body.category,
					date: body.date,
					authorized_date: body.date,
					name: body.transaction_name,
					amount: Number(body.amount),
					update_counter: data.update_counter + 1,
				},
			})

			sendWebsocketMessage({
				action: 'UPDATE',
				object: 'expense',
				user_id: userId,
				pair_id: pair_id,
				content: `$${body.amount} for ${body.transaction_name}`,
			})

			res.status(200).json({ message: 'updated succesfully' })
		} else {
			sendWebsocketMessage({
				action: 'FAILED_UPDATE',
				object: 'expense',
				user_id: userId,
				pair_id: pair_id,
				content: `FAILED UPDATE`,
			})

			res.status(400).json({
				message: 'failed to update expense/transaction',
			})
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error.message })
	}
})

export default expenses
