import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import {
	generateHandshakeCode,
	isAuthenticated,
	isExpired,
} from '../utils/util'

const pair = Router()
const prisma = new PrismaClient()

const EXPIRATION_DURATION = 60 * 10 // seconds

pair.get('/request', isAuthenticated, async (req: Request, res: Response) => {
	const userId = req.session.user.id

	const codeRequest = await prisma.pairRequest.findFirst({
		where: { initiatorUserId: userId },
		orderBy: {
			createdAt: 'desc',
		},
	})

	if (codeRequest && !isExpired(codeRequest.createdAt, EXPIRATION_DURATION)) {
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
			initiatorUserId: userId,
		},
	})

	res.status(200).json({
		message: 'You initiated a pair request',
		...pairRequest,
	})
})

export default pair
