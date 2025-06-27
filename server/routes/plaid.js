const plaid = require('express').Router()
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const CLIENT_ID = process.env.PLAID_CLIENT_ID
const SECRET = process.env.PLAID_SECRET

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': CLIENT_ID,
      'PLAID-SECRET': SECRET,
    },
  },
});

module.exports = plaid