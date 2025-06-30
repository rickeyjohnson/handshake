const pair = require('express').Router()
const { PrismaClient } = require('../generated/prisma')
const { generateHandshakeCode, isAuthenticated, isExpired } = require('../utils/util')
const prisma = new PrismaClient()

const EXPIRATION_DATE_IN_SECONDS = 60 * 5           // 5 minutes

pair.get('/request', isAuthenticated, async (req, res) => {
    const userId = req.session.user.id

    const codeRequest = await prisma.pairRequest.findFirst({
        where: { initiatorUserId: userId },
        orderBy: {
            createdAt: "desc"
        }
    })

    if (codeRequest && !isExpired(codeRequest.createdAt, EXPIRATION_DATE_IN_SECONDS)) {
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

module.exports = pair