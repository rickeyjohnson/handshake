import request from 'supertest'
import { Request, Response } from 'express'
import { app } from './index'
import prisma from './prismaClient'

jest.mock('./utils/util', () => ({
	isAuthenticated: (req: Request, res: Response, next: Function) => next(),
	getPairedId: jest.fn(),
}))

jest.mock('./prismaClient', () => ({
	user: {
		findUnique: jest.fn(),
	},
}))

describe('GET /api/me', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('returns 200 and user data when user is found', async () => {
		;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
			id: '123',
			name: 'Test User',
			email: 'test@example.com',
			partner: { id: 'partner123' },
		})

		const res = await request(app)
			.get('/api/me')
			.set('Cookie', ['sessionId=valid-session'])

		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({
			message: 'User found!',
			id: '123',
			name: 'Test User',
			email: 'test@example.com',
			partner: { id: 'partner123' },
		})
		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { id: undefined },
			include: { partner: true },
		})
	})

	it('returns 404 when user is not found', async () => {
		;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

		const res = await request(app)
			.get('/api/me')
			.set('Cookie', ['sessionId=valid-session'])

		expect(res.status).toBe(404)
		expect(res.body).toEqual({ message: 'User not found' })
	})

	it('returns 500 on prisma error', async () => {
		;(prisma.user.findUnique as jest.Mock).mockRejectedValue(
			new Error('DB error')
		)

		const res = await request(app)
			.get('/api/me')
			.set('Cookie', ['sessionId=valid-session'])

		expect(res.status).toBe(500)
		expect(res.body).toEqual({ error: 'Internal Server Error' })
	})
})
