const pair = require('express').Router()
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

pair.get('/', (req, res) => {
    res.json({message : 'hello'})
})

module.exports = pair