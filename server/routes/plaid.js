// /api/plaid/
const plaid = require('express').Router()
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()
const {
	Configuration,
	PlaidApi,
	PlaidEnvironments,
	Products,
} = require('plaid')
const { isAuthenticated } = require('../utils/util')

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID
const PLAID_SECRET = process.env.PLAID_SECRET
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox'
const PLAID_PRODUCTS = (
	process.env.PLAID_PRODUCTS || Products.Transactions
).split(',')
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',')
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || ''

const configuration = new Configuration({
	basePath: PlaidEnvironments[PLAID_ENV],
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET,
		},
	},
})

const plaidClient = new PlaidApi(configuration)

// CREATE PLAID LINK TOKEN
plaid.post('/create_link_token', isAuthenticated, async (req, res) => {
	const clientUserId = req.session.user.id
	const linkTokenCreateRequest = {
		user: {
			client_user_id: clientUserId,
		},
		client_name: 'Handshake',
		products: PLAID_PRODUCTS,
		country_codes: PLAID_COUNTRY_CODES,
		redirect_uri: PLAID_REDIRECT_URI,
		language: 'en',
	}

	try {
		const createTokenResponse = await plaidClient.linkTokenCreate(
			linkTokenCreateRequest
		)
		res.status(200).json(createTokenResponse.data)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

plaid.post('/exchange_public_token', async (req, res) => {
	const publicToken = req.body.public_token

	try {
		const exchangeTokenResponse = await plaidClient.itemPublicTokenExchange({
			public_token: publicToken,
		})

		const accessToken = exchangeTokenResponse.data.access_token
		const itemId = exchangeTokenResponse.data.item_id

		res.status(200).json({ public_token_exchange: 'complete' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

module.exports = plaid
