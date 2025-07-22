import request from 'supertest'
import express, { Express } from 'express'
import session from 'express-session'
import expensesRouter from '../../routes/expenses'
import { prisma } from '../../routes/expenses' // Assuming prisma is exported from expenses.ts
import * as util from '../../utils/util'

// Mock Prisma client
jest.mock('../../generated/prisma', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      transactions: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    })),
  }
})

// Mock utility functions
jest.mock('../../utils/util', () => ({
  ...jest.requireActual('../../utils/util'),
  getPairedId: jest.fn(),
  sendWebsocketMessage: jest.fn(),
}))

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
  it('should create a new expense and return 201', async () => {
    const mockExpense = {
      id: 'expense1',
      name: 'Dinner',
      amount: 50,
    }
    ;(prisma.transactions.create as jest.Mock).mockResolvedValue(mockExpense)
    ;(util.getPairedId as jest.Mock).mockResolvedValue('pair123')
    ;(util.sendWebsocketMessage as jest.Mock).mockImplementation(() => {})

    const res = await request(app).post('/api/expenses').send({
      accountId: 'acc1',
      category: 'FOOD',
      date: '2025-07-22',
      authorizedDate: '2025-07-22',
      name: 'Dinner',
      amount: 50,
      currencyCode: 'USD',
    })

    expect(res.statusCode).toBe(201)
    expect(prisma.transactions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user_id: mockUser.id,
          pair_id: 'pair123',
          account_id: 'acc1',
          category: 'FOOD',
          name: 'Dinner',
          amount: 50,
          currency_code: 'USD',
        }),
      })
    )
    expect(util.sendWebsocketMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'ADD',
        object: 'expense',
        user_id: mockUser.id,
        pair_id: 'pair123',
        content: '$50 for Dinner',
      })
    )
    expect(res.body.message).toMatch(/new expense added/i)
  })
})

describe('POST /api/expenses/update', () => {
  it('should update an expense if update_counter matches', async () => {
    const existingExpense = { id: 'expense1', update_counter: 1 }
    const updatedExpense = { id: 'expense1', name: 'Dinner', amount: 55 }

    ;(prisma.transactions.findUnique as jest.Mock).mockResolvedValue(existingExpense)
    ;(prisma.transactions.update as jest.Mock).mockResolvedValue(updatedExpense)
    ;(util.getPairedId as jest.Mock).mockResolvedValue('pair123')
    ;(util.sendWebsocketMessage as jest.Mock).mockImplementation(() => {})

    const res = await request(app).post('/api/expenses/update').send({
      id: 'expense1',
      account_id: 'acc1',
      category: 'FOOD',
      date: '2025-07-22',
      authorized_date: '2025-07-22',
      transaction_name: 'Dinner',
      amount: 55,
      update_counter: 1,
    })

    expect(res.statusCode).toBe(200)
    expect(prisma.transactions.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'expense1' },
        data: expect.objectContaining({
          user_id: mockUser.id,
          account_id: 'acc1',
          category: 'FOOD',
          name: 'Dinner',
          amount: 55,
          update_counter: 2,
        }),
      })
    )
    expect(util.sendWebsocketMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'UPDATE',
        object: 'expense',
        user_id: mockUser.id,
        pair_id: 'pair123',
        content: '$55 for Dinner',
      })
    )
    expect(res.body.message).toMatch(/updated/i)
  })

  it('should fail with 400 if update_counter does not match', async () => {
    const existingExpense = { id: 'expense1', update_counter: 2 }

    ;(prisma.transactions.findUnique as jest.Mock).mockResolvedValue(existingExpense)
    ;(util.getPairedId as jest.Mock).mockResolvedValue('pair123')
    ;(util.sendWebsocketMessage as jest.Mock).mockImplementation(() => {})

    const res = await request(app).post('/api/expenses/update').send({
      id: 'expense1',
      account_id: 'acc1',
      category: 'FOOD',
      date: '2025-07-22',
      authorized_date: '2025-07-22',
      transaction_name: 'Dinner',
      amount: 55,
      update_counter: 1,
    })

    expect(res.statusCode).toBe(400)
    expect(util.sendWebsocketMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'FAILED_UPDATE',
        object: 'expense',
        user_id: mockUser.id,
        pair_id: 'pair123',
        content: 'FAILED UPDATE',
      })
    )
    expect(res.body.message).toMatch(/failed to update/i)
    expect(prisma.transactions.update).not.toHaveBeenCalled()
  })
})