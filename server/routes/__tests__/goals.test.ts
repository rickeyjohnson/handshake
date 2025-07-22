import request from 'supertest'
import express from 'express'
import session from 'express-session'
import goalsRouter from '../goals'
import { PrismaClient } from '../../generated/prisma'
import * as util from '../../utils/util'

jest.mock('../../generated/prisma', () => {
  const mGoals = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  }

  const mContributions = {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  }

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      goals: mGoals,
      goalContributions: mContributions,
    })),
  }
})

jest.mock('../../utils/util', () => ({
  getPairedId: jest.fn(),
  sendWebsocketMessage: jest.fn(),
}))

// Initialize app
const app = express()
app.use(express.json())

// Mock session
app.use(
  session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
  })
)

app.use((req, _, next) => {
  if (req.session) {
    req.session.user = { id: 'test-user', name: '', email: '' }
  }
  next()
})

app.use('/goals', goalsRouter)

const prisma = new PrismaClient()

describe('Goals API', () => {
  afterEach(() => jest.clearAllMocks())

  test('GET /goals returns goals for the paired ID', async () => {
    (util.getPairedId as jest.Mock).mockResolvedValue('pair-1')
    ;(prisma.goals.findMany as jest.Mock).mockResolvedValue([{ id: 'goal-1' }])

    const res = await request(app).get('/goals')

    expect(res.status).toBe(200)
    expect(prisma.goals.findMany).toHaveBeenCalledWith({
      where: { pair_id: 'pair-1' },
    })
    expect(res.body).toEqual([{ id: 'goal-1' }])
  })

  test('GET /goals/details/:id returns goal with details', async () => {
    ;(prisma.goals.findUnique as jest.Mock).mockResolvedValue({
      id: 'goal-1',
      user: {},
      contributions: [],
    })

    const res = await request(app).get('/goals/details/goal-1')

    expect(res.status).toBe(200)
    expect(prisma.goals.findUnique).toHaveBeenCalledWith({
      where: { id: 'goal-1' },
      include: { user: true, contributions: true },
    })
  })

  test('POST /goals creates new goal', async () => {
    (util.getPairedId as jest.Mock).mockResolvedValue('pair-1')
    ;(prisma.goals.create as jest.Mock).mockResolvedValue({})

    const goal = {
      title: 'Save Money',
      description: 'For trip',
      target: '1000',
      deadline: '2025-12-31',
    }

    const res = await request(app).post('/goals').send(goal)

    expect(res.status).toBe(201)
    expect(prisma.goals.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Save Money',
        target: 1000,
        deadline: new Date('2025-12-31'),
      }),
    })
    expect(util.sendWebsocketMessage).toHaveBeenCalled()
  })

  test('DELETE /goals deletes a goal', async () => {
    ;(prisma.goals.delete as jest.Mock).mockResolvedValue({})

    const res = await request(app).delete('/goals').send({ goalId: 'goal-1' })

    expect(res.status).toBe(204)
    expect(prisma.goals.delete).toHaveBeenCalledWith({
      where: { id: 'goal-1' },
    })
  })

  test('GET /goals/contributions/ returns contributions', async () => {
    ;(prisma.goalContributions.findMany as jest.Mock).mockResolvedValue([
      { id: 'contrib-1' },
    ])

    const res = await request(app)
      .get('/goals/contributions/')
      .send({ goalId: 'goal-1' })

    expect(res.status).toBe(200)
    expect(prisma.goalContributions.findMany).toHaveBeenCalledWith({
      where: { goal_id: 'goal-1' },
    })
  })

  test('POST /goals/contributions/ creates a contribution', async () => {
    ;(prisma.goalContributions.create as jest.Mock).mockResolvedValue({})

    const res = await request(app).post('/goals/contributions/').send({
      goalId: 'goal-1',
      amount: 50,
      date: '2025-10-10',
    })

    expect(res.status).toBe(200)
    expect(prisma.goalContributions.create).toHaveBeenCalledWith({
      data: {
        goal_id: 'goal-1',
        user_id: 'test-user',
        amount: 50,
        posted_date: new Date('2025-10-10'),
      },
    })
  })

  test('DELETE /goals/contributions/ deletes a contribution', async () => {
    ;(prisma.goalContributions.delete as jest.Mock).mockResolvedValue({})

    const res = await request(app)
      .delete('/goals/contributions/')
      .send({ contributionId: 'contrib-1' })

    expect(res.status).toBe(200)
    expect(prisma.goalContributions.delete).toHaveBeenCalledWith({
      where: { id: 'contrib-1' },
    })
  })
})
