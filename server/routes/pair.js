const pair = require('express').Router()
const { PrismaClient } = require('../generated/prisma')
const { generateHandshakeCode, isAuthenticated, isExpired } = require('../utils/util')
const prisma = new PrismaClient()

const EXPIRATION_DURATION = 60 * 10           // seconds

pair.get('/request', isAuthenticated, async (req, res) => {
    const userId = req.session.user.id

    const codeRequest = await prisma.pairRequest.findFirst({
        where: { initiatorUserId: userId },
        orderBy: {
            createdAt: "desc"
        }
    })

    if (codeRequest && !isExpired(codeRequest.createdAt, EXPIRATION_DURATION)) {
        res.status(200).json({ message: 'You already initiated a pair request', ...codeRequest })
        return
    }

    const code = generateHandshakeCode()
    const pairRequest = await prisma.pairRequest.create({
        data: {
            code: code,
            initiatorUserId: userId,
        }
    })

    res.status(200).json({ message : 'You initiated a pair request', ...pairRequest })
})

pair.post('/enter', isAuthenticated, async(req, res) => {
    const code = req.body.code
    const userId = req.session.user.id

    const pairRequest = await prisma.pairRequest.findUnique({
        where: {
            code: code,
        },
        select: {
            initiatorUserId: true,
            createdAt: true,
        }
    })

    const partnerId = pairRequest.initiatorUserId

    if (!pairRequest) {
        res.status(404).json({error: 'Pairing code not found'})
        return
    }

    if (isExpired(pairRequest.createdAt, EXPIRATION_DURATION)) {
        res.status(410).json({error: 'Pairing code expired'})
        return
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { partnerId: partnerId },
    })

    const partner = await prisma.user.update({
        where: { id: partnerId },
        data: { partnerId: userId },
    })

    res.status(201).json({ message: 'Users successfully paired'})
})

module.exports = pair