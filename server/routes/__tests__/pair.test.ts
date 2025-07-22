import request from 'supertest'
import express from 'express'
import session from 'express-session'
import pairRouter from '../pair'
import { PrismaClient } from '../../generated/prisma'
import * as util from '../../utils/util'

jest.mock('../../generated/prisma', () => {
	return {
		PrismaClient: jest.fn().mockImplementation(() => ({
			pairRequest: {
				findFirst: jest.fn(),
				create: jest.fn(),
				findUnique: jest.fn(),
				update: jest.fn(),
			},
			user: {
				update: jest.fn(),
			},
			pair: {
				create: jest.fn(),
			},
			accounts: {
				updateMany: jest.fn(),
			},
		})),
	}
})

jest.mock('../../utils/util', () => ({
	...jest.requireActual('../utils/util'),
	generateHandshakeCode: jest.fn(() => 'HANDSHAKE123'),
	getPairedId: jest.fn().mockResolvedValue('pair123'),
	isExpired: jest.fn(() => false),
	sendWebsocketMessage: jest.fn(),
	setPairedToComplete: jest.fn(),
	isAuthenticated: (req: any, res: any, next: any) => next(), // mock middleware to pass
}))

const prisma = new PrismaClient()

const findFirstMock = prisma.pairRequest.findFirst as jest.Mock
const createMock = prisma.pairRequest.create as jest.Mock
const findUniqueMock = prisma.pairRequest.findUnique as jest.Mock
const updateMock = prisma.pairRequest.update as jest.Mock
const userUpdateMock = prisma.user.update as jest.Mock
const pairCreateMock = prisma.pair.create as jest.Mock
const accountsUpdateManyMock = prisma.accounts.updateMany as jest.Mock

const generateHandshakeCodeMock = util.generateHandshakeCode as jest.Mock
const getPairedIdMock = util.getPairedId as jest.Mock
const isExpiredMock = util.isExpired as jest.Mock
const sendWebsocketMessageMock = util.sendWebsocketMessage as jest.Mock
const setPairedToCompleteMock = util.setPairedToComplete as jest.Mock

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
	req.session = { user: { id: 'user123' } } as any // cast session for TS
	next()
})
app.use('/pair', pairRouter)

describe('Pair API', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('GET /pair/request', () => {
		it('should return existing pair request if not expired', async () => {
			findFirstMock.mockResolvedValue({
				code: 'EXISTINGCODE',
				created_at: new Date(),
				initiator_user_id: 'user123',
			})
			isExpiredMock.mockReturnValue(false)

			const res = await request(app).get('/pair/request')

			expect(res.status).toBe(200)
			expect(res.body).toMatchObject({
				message: 'You already initiated a pair request',
				code: 'EXISTINGCODE',
			})
			expect(findFirstMock).toHaveBeenCalledWith({
				where: { initiator_user_id: 'user123' },
				orderBy: { created_at: 'desc' },
			})
			expect(isExpiredMock).toHaveBeenCalled()
		})

		it('should create a new pair request if none or expired', async () => {
			findFirstMock.mockResolvedValue(null)
			createMock.mockResolvedValue({
				code: 'NEWCODE',
				initiator_user_id: 'user123',
				created_at: new Date(),
			})
			generateHandshakeCodeMock.mockReturnValue('NEWCODE')

			const res = await request(app).get('/pair/request')

			expect(res.status).toBe(200)
			expect(res.body).toMatchObject({
				message: 'You initiated a pair request',
				code: 'NEWCODE',
			})
			expect(createMock).toHaveBeenCalledWith({
				data: { code: 'NEWCODE', initiator_user_id: 'user123' },
			})
		})
	})

	describe('POST /pair/enter', () => {
		it('should reject if already paired', async () => {
			// Simulate session user already has partner_id
			app.use((req, _, next) => {
				req.session = {
					user: { id: 'user123', partner_id: 'partner456' },
				} as any
				next()
			})

			const res = await request(app)
				.post('/pair/enter')
				.send({ code: 'ANYCODE' })

			expect(res.status).toBe(400)
			expect(res.body.message).toBe(
				'You are already paired with another user.'
			)
		})

		it('should return 404 if pairRequest not found', async () => {
			app.use((req, _, next) => {
				req.session = { user: { id: 'user123' } } as any
				next()
			})
			findUniqueMock.mockResolvedValue(null)

			const res = await request(app)
				.post('/pair/enter')
				.send({ code: 'NONEXISTENT' })

			expect(res.status).toBe(404)
			expect(res.body.error).toBe('Pairing code not found')
		})

		it('should return 410 if pairing code expired', async () => {
			findUniqueMock.mockResolvedValue({
				initiator_user_id: 'partner123',
				created_at: new Date(Date.now() - 1000000),
			})
			isExpiredMock.mockReturnValue(true)

			const res = await request(app)
				.post('/pair/enter')
				.send({ code: 'EXPIREDCODE' })

			expect(res.status).toBe(410)
			expect(res.body.error).toBe('Pairing code expired')
		})

		it('should return 400 if user tries to pair with self', async () => {
			findUniqueMock.mockResolvedValue({
				initiator_user_id: 'user123',
				created_at: new Date(),
			})
			isExpiredMock.mockReturnValue(false)

			const res = await request(app)
				.post('/pair/enter')
				.send({ code: 'SELFPAIRCODE' })

			expect(res.status).toBe(400)
			expect(res.body.error).toBe('Pairing with yourself is not allowed.')
		})

		it('should complete pairing successfully', async () => {
			findUniqueMock.mockResolvedValue({
				initiator_user_id: 'partner123',
				created_at: new Date(),
			})
			isExpiredMock.mockReturnValue(false)

			userUpdateMock.mockResolvedValue({})
			pairCreateMock.mockResolvedValue({})
			updateMock.mockResolvedValue({})
			accountsUpdateManyMock.mockResolvedValue({})

			const res = await request(app)
				.post('/pair/enter')
				.send({ code: 'VALIDCODE' })

			expect(res.status).toBe(201)
			expect(userUpdateMock).toHaveBeenCalledTimes(2)
			expect(pairCreateMock).toHaveBeenCalledTimes(1)
			expect(updateMock).toHaveBeenCalledTimes(1)
			expect(accountsUpdateManyMock).toHaveBeenCalledTimes(2)
			expect(sendWebsocketMessageMock).toHaveBeenCalledWith(
				expect.objectContaining({
					action: 'PAIR',
					object: 'pairing',
					user_id: 'user123',
					pair_id: 'pair123',
					content: 'pairing!',
				})
			)
			expect(setPairedToCompleteMock).toHaveBeenCalledWith(
				'user123',
				'partner123'
			)
		})
	})
})
