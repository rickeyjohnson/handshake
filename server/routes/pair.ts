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

pair.post('/enter', isAuthenticated, async(req, res) => {
    const code = req.body.code
    const userId = req.session.user.id

    if (req.session.user.partnerId) {
        res.status(400).json({ message: 'You are already paired with another user.' })
        return
    }

    const pairRequest = await prisma.pairRequest.findUnique({
        where: {
            code: code,
            status: 'PENDING',
        },
        select: {
            initiatorUserId: true,
            createdAt: true,
        }
    })

    if (!pairRequest) {
        res.status(404).json({error: 'Pairing code not found'})
        return
    }

    const partnerId = pairRequest.initiatorUserId

    if (isExpired(pairRequest.createdAt, EXPIRATION_DURATION)) {
        res.status(410).json({error: 'Pairing code expired'})
        return
    }

    if (partnerId === userId) {
        res.status(400).json({ error: 'Pairing with yourself is not allowed.' })
        return
    }

    await prisma.user.update({
        where: { id: userId },
        data: { partnerId: partnerId },
    })

    await prisma.user.update({
        where: { id: partnerId },
        data: { partnerId: userId },
    })

    await prisma.pairRequest.update({
        where: { code: code },
        data: {
            status: 'COMPLETED'
        }
    })

    await prisma.pair.create({
        data: {
            user1Id: userId,
            user2Id: partnerId,
        }
    })

    res.status(201).json({ message: 'Users successfully paired'})
})

export default pair
