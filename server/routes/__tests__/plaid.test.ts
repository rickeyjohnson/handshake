import request from 'supertest'
import express from 'express'
import session from 'express-session'
import plaidRouter from '../plaid'
import { PrismaClient } from '../../generated/prisma'
import * as util from '../../utils/util'

jest.mock('../../generated/prisma', () => {
	return {
		PrismaClient: jest.fn().mockImplementation(() => ({
			plaidItem: {
				create: jest.fn(),
				update: jest.fn(),
			},
			accounts: {
				create: jest.fn(),
			},
		})),
	}
})

jest.mock('../../utils/util', () => ({
	addNewTransaction: jest.fn(),
	deleteExistingTransaction: jest.fn(),
	extractAccountDetails: jest.fn(),
	getItemIdsForUser: jest.fn(),
	getItemInfo: jest.fn(),
	getPairedId: jest.fn(),
	getUserAccessToken: jest.fn(),
	isAuthenticated: jest.fn((req, res, next) => next()),
	modifyExistingTransactions: jest.fn(),
	saveCursorForItem: jest.fn(),
	setPlaidLinkToComplete: jest.fn(),
	simpleTransactionFromPlaidTransaction: jest.fn(),
}))

jest.mock('plaid', () => {
	class PlaidApiMock {
		linkTokenCreate = jest.fn()
		itemPublicTokenExchange = jest.fn()
		transactionsSync = jest.fn()
		itemGet = jest.fn()
		institutionsGetById = jest.fn()
		accountsGet = jest.fn()
	}
	return {
		PlaidApi: PlaidApiMock,
		Configuration: jest.fn(),
		PlaidEnvironments: { sandbox: 'sandbox' },
		Products: { Auth: 'auth', Transactions: 'transactions' },
		CountryCode: { Us: 'US' },
	}
})

const prisma = new PrismaClient()
const app = express()
app.use(express.json())
app.use(
	session({
		secret: 'testsecret',
		resave: false,
		saveUninitialized: false,
	})
)

app.use((req, res, next) => {
	if (req.session) {
		req.session.user = {
			id: 'test-user',
			email: '',
			name: '',
			partner_id: 'partner-id',
		}
	}
	next()
})

app.use('/api/plaid', plaidRouter)

describe('Plaid API', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('GET /transactions/sync', () => {
		test('handles error syncing transactions', async () => {
			;(util.getItemIdsForUser as jest.Mock).mockRejectedValue(
				new Error('Sync failed')
			)

			const res = await request(app).get('/api/plaid/transactions/sync')

			expect(res.status).toBe(500)
			expect(res.body.error).toBe('Sync failed')
		})
	})

	describe('GET /transactions/list', () => {
		test('handles error fetching transactions', async () => {
			;(util.getPairedId as jest.Mock).mockRejectedValue(
				new Error('Failed fetching txns')
			)

			const res = await request(app).get('/api/plaid/transactions/list')

			expect(res.status).toBe(500)
			expect(res.body.error).toBe('Failed fetching txns')
		})
	})
})
