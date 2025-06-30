const pair = require('express').Router()
const { PrismaClient } = require('../generated/prisma')
const { generateHandshakeCode, isAuthenticated } = require('../utils/util')
const prisma = new PrismaClient()

pair.get('/request', isAuthenticated, async (req, res) => {
    const userId = req.session.user.id

    const code = await prisma.pairRequest.findFirst({
        where: { initiatorUserId: userId },
        orderBy: {
            createdAt: "desc"
        },
        select: {
            code: true,
        }
    })

    if (code) { 
        res.status(200).json({ message: 'You already initiated a pair request', ...code })
    } else {
        const newCode = generateHandshakeCode()

        const pairRequest = await prisma.pairRequest.create({
            data: {
                code: newCode,
                initiatorUserId: userId,
            }
        })

        res.status(200).json({ message : 'You have initiated a pair request', ...pairRequest })
    }
})

module.exports = pair