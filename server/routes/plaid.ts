// /api/plaid/
import { Router } from 'express'
import { PrismaClient } from '../generated/prisma'
import {
	Configuration,
	CountryCode,
	LinkTokenCreateRequest,
	PlaidApi,
	PlaidEnvironments,
	Products,
} from 'plaid'
import { getItemInfo, isAuthenticated } from '../utils/util'

const plaid = Router()
const prisma = new PrismaClient()

const PLAID_CLIENT_ID: string = process.env.PLAID_CLIENT_ID || 'unknown'
const PLAID_SECRET: string = process.env.PLAID_SECRET || 'unknown'
const PLAID_ENV: string = process.env.PLAID_ENV || 'sandbox'
const PLAID_PRODUCTS: Products[] = [
	Products.Auth,
	Products.Transactions,
]
const PLAID_COUNTRY_CODES: CountryCode[] = [CountryCode.Us]
const PLAID_REDIRECT_URI: string = process.env.PLAID_REDIRECT_URI || ''

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
	const linkTokenCreateRequest: LinkTokenCreateRequest = {
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
		res.status(500).json({ error: error.message, message: 'this is failing' })
	}
})

plaid.post('/exchange_public_token', async (req, res) => {
	const userId = req.session.user.id
	const publicToken = req.body.public_token

	try {
		const exchangeTokenResponse = await plaidClient.itemPublicTokenExchange(
			{
				public_token: publicToken,
			}
		)

		const accessToken = exchangeTokenResponse.data.access_token
		const itemId = exchangeTokenResponse.data.item_id

		const createPlaidItem = await prisma.plaidItem.create({
			data: {
				id: itemId,
				access_token: accessToken,
				owner_id: userId,
			}
		})

		res.status(200).json({ public_token_exchange: 'complete' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// PLAID API ENDPOINTS FOR FETCHING BANK DATA
plaid.get('/accounts', async (req, res) => {
	const userId = req.session.user.id
	const { access_token: accessToken } = await getItemInfo(userId)

	try {
		const accountsResponse = await plaidClient.accountsGet({
			access_token: accessToken,
		})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default plaid
