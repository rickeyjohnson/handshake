import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import {
	generateHandshakeCode,
	getPairedId,
	isAuthenticated,
	isExpired,
	setPairedToComplete,
} from '../utils/util'
import { connectedClients } from '../websocket/wsStore'

const pair = Router()
const prisma = new PrismaClient()

const EXPIRATION_DURATION = 60 * 10 // seconds

pair.get('/request', isAuthenticated, async (req: Request, res: Response) => {
	const userId = req.session.user.id

	const codeRequest = await prisma.pairRequest.findFirst({
		where: { initiator_user_id: userId },
		orderBy: {
			created_at: 'desc',
		},
	})

	if (
		codeRequest &&
		!isExpired(codeRequest.created_at, EXPIRATION_DURATION)
	) {
		res.status(200).json({
			message: 'You already initiated a pair request',
			...codeRequest,
		})
		return
	}

	const code = generateHandshakeCode()
	const pairRequest = await prisma.pairRequest.create({
		data: {
			code: code,
			initiator_user_id: userId,
		},
	})

	res.status(200).json({
		message: 'You initiated a pair request',
		...pairRequest,
	})
})

pair.post('/enter', isAuthenticated, async (req, res) => {
	const code = req.body.code
	const userId = req.session.user.id

	if (req.session.user.partner_id) {
		res.status(400).json({
			message: 'You are already paired with another user.',
		})
		return
	}

	const pairRequest = await prisma.pairRequest.findUnique({
		where: {
			code: code,
			status: 'PENDING',
		},
		select: {
			initiator_user_id: true,
			created_at: true,
		},
	})

	if (!pairRequest) {
		res.status(404).json({ error: 'Pairing code not found' })
		return
	}

	const partnerId = pairRequest.initiator_user_id

	if (isExpired(pairRequest.created_at, EXPIRATION_DURATION)) {
		res.status(410).json({ error: 'Pairing code expired' })
		return
	}

	if (partnerId === userId) {
		res.status(400).json({ error: 'Pairing with yourself is not allowed.' })
		return
	}

	await prisma.user.update({
		where: { id: userId },
		data: { partner_id: partnerId },
	})

	await prisma.user.update({
		where: { id: partnerId },
		data: { partner_id: userId },
	})

	await prisma.pairRequest.update({
		where: { code: code },
		data: {
			status: 'COMPLETED',
		},
	})

	await prisma.pair.create({
		data: {
			user1_id: userId,
			user2_id: partnerId,
		},
	})

	const pairId = await getPairedId(userId)

	await prisma.accounts.updateMany({
		where: { user_id: userId },
		data: {
			pair_id: pairId,
		},
	})

	await prisma.accounts.updateMany({
		where: { user_id: partnerId },
		data: {
			pair_id: pairId,
		},
	})

	connectedClients.forEach((client) => {
		if (client.readyState === 1) {
			client.send(JSON.stringify({ paired: true }))
		}
	})

	await setPairedToComplete(userId, partnerId)

	res.status(201).json({ message: 'Users successfully paired' })
})

export default pair
