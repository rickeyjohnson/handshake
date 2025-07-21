import request from 'supertest'
import express, { Express } from 'express'
import session from 'express-session'

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

import budgetsRouter from '../../routes/budgets'
import { PrismaClient } from '../../generated/prisma'
import * as util from '../../utils/util'

jest.mock('../../utils/util', () => ({
	...jest.requireActual('../../utils/util'),
	getPairedId: jest.fn(),
	getSpendingOnCategory: jest.fn(),
	sendWebsocketMessage: jest.fn(),
}))

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

let app: Express

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

	// Mount router on /api/budgets
	app.use('/api/budgets', budgetsRouter)
})

afterEach(() => {
	jest.clearAllMocks()
})

describe('GET /api/budgets', () => {
	it('should return budgets for current month', async () => {
		const mockBudgets = [{ id: '1', category: 'FOOD', budgeted: 200 }]
		prisma.budgets.findMany.mockResolvedValue(mockBudgets)
		;(util.getPairedId as jest.Mock).mockResolvedValue('pair123')

		const res = await request(app).get('/api/budgets')

		expect(res.statusCode).toBe(200)
		expect(prisma.budgets.findMany).toHaveBeenCalled()
		expect(res.body).toEqual(mockBudgets)
	})
})

describe('POST /api/budgets', () => {
	it('should create a new budget', async () => {
		prisma.budgets.create.mockResolvedValue({ id: '1', category: 'FOOD' })
		;(util.getPairedId as jest.Mock).mockResolvedValue('pair123')
		;(util.getSpendingOnCategory as jest.Mock).mockResolvedValue(50)
		;(util.sendWebsocketMessage as jest.Mock).mockImplementation(() => {})

		const res = await request(app).post('/api/budgets').send({
			category: 'FOOD',
			budgeted: '200',
		})

		expect(res.statusCode).toBe(200)
		expect(prisma.budgets.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					pair_id: 'pair123',
					category: 'FOOD',
					budgeted: 200,
					actual: 50,
				}),
			})
		)
		expect(util.sendWebsocketMessage).toHaveBeenCalled()
		expect(res.body.message).toMatch(/Budget successfully created/i)
	})
})

describe('POST /api/budgets/update', () => {
	it('should update a budget', async () => {
		prisma.budgets.update.mockResolvedValue({ id: '1', budgeted: 300 })

		const res = await request(app).post('/api/budgets/update').send({
			budgetId: '1',
			budgeted: '300',
		})

		expect(res.statusCode).toBe(200)
		expect(prisma.budgets.update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { id: '1' },
				data: { budgeted: 300 },
			})
		)
		expect(res.body.message).toMatch(/updated/i)
	})
})

describe('DELETE /api/budgets', () => {
	it('should delete a budget', async () => {
		prisma.budgets.delete.mockResolvedValue({ id: '1' })

		const res = await request(app)
			.delete('/api/budgets')
			.send({ budgetId: '1' })

		expect(res.statusCode).toBe(204)
		expect(prisma.budgets.delete).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { id: '1' },
			})
		)
	})
})
