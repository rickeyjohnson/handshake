const plaid = require('express').Router()
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

module.exports = plaid