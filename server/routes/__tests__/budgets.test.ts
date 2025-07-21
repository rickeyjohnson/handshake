import request from 'supertest'
import express, { Express } from 'express'
import session from 'express-session'
import budgetsRouter from '../../routes/budgets'
import { PrismaClient } from '../../generated/prisma'
import * as util from '../../utils/util'

jest.mock('../../generated/prisma', () => {
	return {
		PrismaClient: jest.fn().mockImplementation(() => ({
			budgets: {
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
	getSpendingOnCategory: jest.fn(),
	sendWebsocketMessage: jest.fn(),
}))

let app: Express
const prisma = new PrismaClient() as unknown as {
	budgets: {
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

	app.use((req, res, next) => {
		;(req.session as any).user = mockUser
		next()
	})

	app.use('/', budgetsRouter)
})

afterEach(() => {
	jest.clearAllMocks()
})

describe('GET /', () => {
	it('should return budgets for current month', async () => {
		const mockBudgets = [{ id: '1', category: 'FOOD', budgeted: 200 }]
		prisma.budgets.findMany.mockResolvedValue(mockBudgets)
		;(util.getPairedId as jest.Mock).mockResolvedValue('pair123')

		const res = await request(app).get('/')

		expect(res.statusCode).toBe(200)
	})
})

describe('POST /', () => {
	it('should create a new budget', async () => {
		prisma.budgets.create.mockResolvedValue({ id: '1', category: 'FOOD' })
		;(util.getPairedId as jest.Mock).mockResolvedValue('pair123')
		;(util.getSpendingOnCategory as jest.Mock).mockResolvedValue(50)

		const res = await request(app).post('/').send({
			category: 'FOOD',
			budgeted: '200',
		})

		expect(res.statusCode).toBe(200)
		expect(res.body.message).toMatch(/Budget successfully created/i)
	})
})

describe('POST /update', () => {
	it('should update a budget', async () => {
		prisma.budgets.update.mockResolvedValue({ id: '1', budgeted: 300 })

		const res = await request(app).post('/update').send({
			budgetId: '1',
			budgeted: '300',
		})

		expect(res.statusCode).toBe(200)
		expect(res.body.message).toMatch(/updated/i)
	})
})

describe('DELETE /', () => {
	it('should delete a budget', async () => {
		prisma.budgets.delete.mockResolvedValue({ id: '1' })

		const res = await request(app).delete('/').send({ budgetId: '1' })

		expect(res.statusCode).toBe(204)
	})
})
