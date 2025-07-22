import request from 'supertest'
import express from 'express'
import session from 'express-session'
import plaidRouter from '../plaid'
import { PrismaClient } from '../../generated/prisma'
import * as util from '../../utils/util'
import * as plaid from '../plaid'
import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid'

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

jest.mock('plaid', () => {
	const mockPlaidApi = {
		linkTokenCreate: jest.fn(),
		itemPublicTokenExchange: jest.fn(),
		itemGet: jest.fn(),
		institutionsGetById: jest.fn(),
		accountsGet: jest.fn(),
		transactionsSync: jest.fn(),
	}

	return {
		Configuration: jest.fn(),
		PlaidApi: jest.fn(() => mockPlaidApi),
		PlaidEnvironments: {
			sandbox: 'https://sandbox.plaid.com',
			development: 'https://development.plaid.com',
			production: 'https://production.plaid.com',
		},
		Products: {},
		CountryCode: {},
	}
})

jest.mock('../../utils/util', () => ({
	...jest.requireActual('../utils/util'),
	isAuthenticated: (req: any, res: any, next: any) => next(),
	getUserAccessToken: jest.fn(),
	extractAccountDetails: jest.fn(),
	getItemIdsForUser: jest.fn(),
	syncTransactions: jest.fn(),
	getPairedId: jest.fn(),
	getTransactionsForUserOrPair: jest.fn(),
	setPlaidLinkToComplete: jest.fn(),
	populateBankName: jest.fn(),
	populateAccountNames: jest.fn(),
	simpleTransactionFromPlaidTransaction: jest.fn(),
	addNewTransaction: jest.fn(),
	modifyExistingTransactions: jest.fn(),
	deleteExistingTransaction: jest.fn(),
	saveCursorForItem: jest.fn(),
}))

const prisma = new PrismaClient()
const plaidApiInstance = new PlaidApi(new Configuration({}))

// Cast mocks for TS
const plaidLinkTokenCreateMock = plaidApiInstance.linkTokenCreate as jest.Mock
const plaidItemPublicTokenExchangeMock =
	plaidApiInstance.itemPublicTokenExchange as jest.Mock
const prismaPlaidItemCreateMock = prisma.plaidItem.create as jest.Mock
const setPlaidLinkToCompleteMock = util.setPlaidLinkToComplete as jest.Mock
const getUserAccessTokenMock = util.getUserAccessToken as jest.Mock
const extractAccountDetailsMock = util.extractAccountDetails as jest.Mock
const getItemIdsForUserMock = util.getItemIdsForUser as jest.Mock
const syncTransactionsMock = jest.fn()
const getPairedIdMock = util.getPairedId as jest.Mock
const getTransactionsForUserOrPairMock =
	util.getTransactionsForUserOrPair as jest.Mock

const app = express()
app.use(express.json())
app.use(
	session({
		secret: 'testsecret',
		resave: false,
		saveUninitialized: false,
	})
)
app.use((req, _, next) => {
	req.session = { user: { id: 'user123', partner_id: 'partner456' } } as any
	next()
})
app.use('/plaid', plaidRouter)

describe('Plaid API routes', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('POST /plaid/create_link_token', () => {
		it('should create a link token', async () => {
			plaidLinkTokenCreateMock.mockResolvedValue({
				data: { link_token: 'token123' },
			})

			const res = await request(app).post('/plaid/create_link_token')

			expect(res.status).toBe(200)
			expect(res.body).toEqual({ link_token: 'token123' })
			expect(plaidLinkTokenCreateMock).toHaveBeenCalled()
		})

		it('should handle plaid API error', async () => {
			plaidLinkTokenCreateMock.mockRejectedValue(new Error('API error'))

			const res = await request(app).post('/plaid/create_link_token')

			expect(res.status).toBe(500)
			expect(res.body).toHaveProperty('error')
		})
	})

	describe('POST /plaid/exchange_public_token', () => {
		it('should exchange public token and create plaidItem', async () => {
			plaidItemPublicTokenExchangeMock.mockResolvedValue({
				data: { access_token: 'access123', item_id: 'item123' },
			})
			prismaPlaidItemCreateMock.mockResolvedValue({})
			setPlaidLinkToCompleteMock.mockResolvedValue(undefined)

			const res = await request(app)
				.post('/plaid/exchange_public_token')
				.send({ public_token: 'public123' })

			expect(res.status).toBe(200)
			expect(res.body).toEqual({ public_token_exchange: 'complete' })
			expect(plaidItemPublicTokenExchangeMock).toHaveBeenCalledWith({
				public_token: 'public123',
			})
			expect(prismaPlaidItemCreateMock).toHaveBeenCalledWith({
				data: {
					id: 'item123',
					access_token: 'access123',
					owner_id: 'user123',
				},
			})
			expect(setPlaidLinkToCompleteMock).toHaveBeenCalledWith('user123')
		})

		it('should handle errors during public token exchange', async () => {
			plaidItemPublicTokenExchangeMock.mockRejectedValue(
				new Error('Exchange failed')
			)

			const res = await request(app)
				.post('/plaid/exchange_public_token')
				.send({ public_token: 'badtoken' })

			expect(res.status).toBe(500)
			expect(res.body).toHaveProperty('error')
		})
	})

	describe('GET /plaid/accounts/get', () => {
		it('should get combined user and partner accounts', async () => {
			getUserAccessTokenMock.mockImplementation((userId) =>
				Promise.resolve(userId === 'user123' ? 'token1' : 'token2')
			)
			plaidApiInstance.accountsGet = jest
				.fn()
				.mockImplementation(({ access_token }) => {
					if (access_token === 'token1') {
						return Promise.resolve({
							data: {
								accounts: [{ account_id: 'a1' }],
								item: { item_id: 'item1' },
							},
						})
					}
					if (access_token === 'token2') {
						return Promise.resolve({
							data: {
								accounts: [{ account_id: 'a2' }],
								item: { item_id: 'item2' },
							},
						})
					}
					return Promise.reject(new Error('Unknown token'))
				})
			extractAccountDetailsMock.mockImplementation(
				(accounts, item, userId) =>
					accounts.map((acc: any) => ({
						account_id: acc.account_id,
						userId,
					}))
			)

			const res = await request(app).get('/plaid/accounts/get')

			expect(res.status).toBe(200)
			expect(res.body).toEqual([
				{ account_id: 'a1', userId: 'user123' },
				{ account_id: 'a2', userId: 'partner456' },
			])
		})

		it('should handle error in accounts/get', async () => {
			getUserAccessTokenMock.mockRejectedValue(new Error('Token error'))

			const res = await request(app).get('/plaid/accounts/get')

			expect(res.status).toBe(500)
			expect(res.body).toHaveProperty('error')
		})
	})

	describe('GET /plaid/transactions/sync', () => {
		it('should sync transactions for all items', async () => {
			getItemIdsForUserMock.mockResolvedValue([
				{ id: 'item1' },
				{ id: 'item2' },
			])
			const syncTransactionsFunc = jest.fn().mockResolvedValue('done')
			const res = await request(app).get('/plaid/transactions/sync')

			expect(res.status).toBe(200)
			expect(getItemIdsForUserMock).toHaveBeenCalled()
		})

		it('should handle error in transactions/sync', async () => {
			getItemIdsForUserMock.mockRejectedValue(
				new Error('Failed to get items')
			)

			const res = await request(app).get('/plaid/transactions/sync')

			expect(res.status).toBe(500)
			expect(res.body).toHaveProperty('error')
		})
	})

	describe('GET /plaid/transactions/list', () => {
		it('should return transactions for user or pair', async () => {
			getPairedIdMock.mockResolvedValue('pair123')
			getTransactionsForUserOrPairMock.mockResolvedValue([
				{ id: 'txn1' },
				{ id: 'txn2' },
			])

			const res = await request(app).get('/plaid/transactions/list')

			expect(res.status).toBe(200)
			expect(getPairedIdMock).toHaveBeenCalledWith('user123')
			expect(getTransactionsForUserOrPairMock).toHaveBeenCalledWith(
				'pair123',
				100
			)
			expect(res.body).toEqual([{ id: 'txn1' }, { id: 'txn2' }])
		})

		it('should handle error in transactions/list', async () => {
			getPairedIdMock.mockRejectedValue(new Error('Failed to get pairId'))

			const res = await request(app).get('/plaid/transactions/list')

			expect(res.status).toBe(500)
			expect(res.body).toHaveProperty('error')
		})
	})
})
