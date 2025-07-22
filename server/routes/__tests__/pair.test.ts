import request from 'supertest'
import express from 'express'
import session from 'express-session'
import { pair } from '../pair'
import { PrismaClient } from '../../generated/prisma'
import * as util from '../../utils/util'

jest.mock('../../generated/prisma', () => {
	const mPairRequest = {
		findFirst: jest.fn(),
		create: jest.fn(),
		findUnique: jest.fn(),
		update: jest.fn(),
	}
	const mUser = {
		update: jest.fn(),
	}
	const mPair = {
		create: jest.fn(),
	}
	const mAccounts = {
		updateMany: jest.fn(),
	}
	return {
		PrismaClient: jest.fn().mockImplementation(() => ({
			pairRequest: mPairRequest,
			user: mUser,
			pair: mPair,
			accounts: mAccounts,
		})),
	}
})

jest.mock('../../utils/util', () => ({
	isExpired: jest.fn(),
	generateHandshakeCode: jest.fn(),
	getPairedId: jest.fn(),
	sendWebsocketMessage: jest.fn(),
	setPairedToComplete: jest.fn(),
	isAuthenticated: jest.fn((req, res, next) => next()),
}))

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
			partner_id: null,
		}
	}
	next()
})

app.use('/pair', pair)

describe('Pair API', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	test('GET /pair/request creates new pair request if none or expired', async () => {
		;(prisma.pairRequest.findFirst as jest.Mock).mockResolvedValue(null)
		;(util.isExpired as jest.Mock).mockReturnValue(true)
		;(util.generateHandshakeCode as jest.Mock).mockReturnValue('XYZ789')
		;(prisma.pairRequest.create as jest.Mock).mockResolvedValue({
			id: '1',
			code: 'XYZ789',
			initiator_user_id: 'test-user',
			created_at: new Date(),
		})

		const res = await request(app).get('/pair/request')

		expect(res.status).toBe(200)
		expect(res.body.code).toBe('XYZ789')
		expect(prisma.pairRequest.create).toHaveBeenCalled()
	})

	test('GET /pair/request reuses existing request if not expired', async () => {
		;(prisma.pairRequest.findFirst as jest.Mock).mockResolvedValue({
			id: 'req-1',
			code: 'ABC123',
			created_at: new Date(),
		})
		;(util.isExpired as jest.Mock).mockReturnValue(false)

		const res = await request(app).get('/pair/request')

		expect(res.status).toBe(200)
		expect(res.body.code).toBe('ABC123')
		expect(prisma.pairRequest.create).not.toHaveBeenCalled()
	})

	test('POST /pair/enter returns 404 if pair code not found', async () => {
		;(prisma.pairRequest.findUnique as jest.Mock).mockResolvedValue(null)

		const res = await request(app)
			.post('/pair/enter')
			.send({ code: 'INVALID' })

		expect(res.status).toBe(404)
		expect(res.body.error).toMatch(/not found/i)
	})

	test('POST /pair/enter returns 410 if pairing code expired', async () => {
		;(prisma.pairRequest.findUnique as jest.Mock).mockResolvedValue({
			initiator_user_id: 'other-user',
			created_at: new Date(Date.now() - 1000000),
		})
		;(util.isExpired as jest.Mock).mockReturnValue(true)

		const res = await request(app)
			.post('/pair/enter')
			.send({ code: 'EXPIRED' })

		expect(res.status).toBe(410)
		expect(res.body.error).toMatch(/expired/i)
	})

	test('POST /pair/enter returns 400 if pairing with self', async () => {
		;(prisma.pairRequest.findUnique as jest.Mock).mockResolvedValue({
			initiator_user_id: 'test-user',
			created_at: new Date(),
		})
		;(util.isExpired as jest.Mock).mockReturnValue(false)

		const res = await request(app)
			.post('/pair/enter')
			.send({ code: 'SELF' })

		expect(res.status).toBe(400)
		expect(res.body.error).toMatch(/yourself/i)
	})

	test('POST /pair/enter pairs two users successfully', async () => {
		;(prisma.pairRequest.findUnique as jest.Mock).mockResolvedValue({
			initiator_user_id: 'partner-user',
			created_at: new Date(),
		})
		;(util.isExpired as jest.Mock).mockReturnValue(false)
		;(util.getPairedId as jest.Mock).mockResolvedValue('pair-123')
		;(prisma.user.update as jest.Mock).mockResolvedValue({})
		;(prisma.pairRequest.update as jest.Mock).mockResolvedValue({})
		;(prisma.pair.create as jest.Mock).mockResolvedValue({})
		;(prisma.accounts.updateMany as jest.Mock).mockResolvedValue({})
		;(util.sendWebsocketMessage as jest.Mock).mockImplementation(() => {})
		;(util.setPairedToComplete as jest.Mock).mockResolvedValue({})

		const res = await request(app)
			.post('/pair/enter')
			.send({ code: 'PAIR123' })

		expect(res.status).toBe(201)
		expect(prisma.user.update).toHaveBeenCalledTimes(2)
		expect(prisma.pairRequest.update).toHaveBeenCalled()
		expect(prisma.pair.create).toHaveBeenCalled()
		expect(prisma.accounts.updateMany).toHaveBeenCalledTimes(2)
		expect(util.sendWebsocketMessage).toHaveBeenCalled()
		expect(util.setPairedToComplete).toHaveBeenCalled()
	})
})
