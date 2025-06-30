const pair = require('express').Router()
const { PrismaClient } = require('../generated/prisma')
const { generateHandshakeCode } = require('../utils/util')
const prisma = new PrismaClient()

pair.get('/request', async (req, res) => {
    const userId = req.session.user.id

    const code = await prisma.pairRequest.findFirst({
        where: { id: userId },
        orderBy: {
            createdAt: "desc"
        },
        select: {
            code: true,
        }
    })

    if (code) { return res.status(200).json({ code: code })}

    res.status(200).json({ message : 'you have no pair request pending' })
})

module.exports = pair