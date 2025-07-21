import request from 'supertest'
import express, { Express } from 'express'
import session from 'express-session'
import expensesRouter from '../../routes/expenses' // your actual expenses router path
import { PrismaClient } from '../../generated/prisma'
import * as util from '../../utils/util'

jest.mock('../../generated/prisma', () => {
	return {
		PrismaClient: jest.fn().mockImplementation(() => ({
			transactions: {
				findMany: jest.fn(),
				create: jest.fn(),
				update: jest.fn(),
				delete: jest.fn(),
			},
		})),
	}
})

jest.mock('../../utils/util', () => ({
	...jest.requireActual('../../utils/util'),
	getPairedId: jest.fn(),
	sendWebsocketMessage: jest.fn(),
}))

let app: Express
const prisma = new PrismaClient() as unknown as {
	transactions: {
		findMany: jest.Mock
		create: jest.Mock
		update: jest.Mock
		delete: jest.Mock
	}
}

const mockUser = {
	id: '123',
	name: 'Test User',
	email: 'test@example.com',
	partner_id: '456',
}

beforeEach(() => {
	app = express()
	app.use(express.json())
	app.use(
		session({
			secret: 'testsecret',
			resave: false,
			saveUninitialized: false,
		})
	)

	// Mock session user
	app.use((req, res, next) => {
		;(req.session as any).user = mockUser
		next()
	})

	app.use('/api/expenses', expensesRouter)
})

afterEach(() => {
	jest.clearAllMocks()
})

describe('POST /api/expenses', () => {
	it('should create a new expense', async () => {
		const mockCreatedExpense = {
			id: 'random-id',
			user_id: mockUser.id,
			pair_id: 'pair123',
			account_id: 'account123',
			category: 'FOOD',
			date: '2025-07-21',
			authorized_date: '2025-07-21',
			name: 'Some Merchant',
			amount: 100,
			currency_code: 'USD',
		}
		prisma.transactions.create.mockResolvedValue(mockCreatedExpense)
		;(util.getPairedId as jest.Mock).mockResolvedValue('pair123')

		const postBody = {
			accountId: 'account123',
			category: 'FOOD',
			date: '2025-07-21',
			authorizedDate: '2025-07-21',
			name: 'Some Merchant',
			amount: 100,
			currencyCode: 'USD',
		}

		const res = await request(app).post('/api/expenses').send(postBody)

		expect(res.statusCode).toBe(201)
		expect(res.body.message).toMatch('New expense added')
	})
})
