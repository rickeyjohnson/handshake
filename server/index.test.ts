import request from 'supertest'
import express, { Request, Response } from 'express'
import { app } from './index' // Adjust path to your Express app
import prisma from './prismaClient' // Adjust path to your Prisma client
import * as util from './utils/util' // Adjust path to your isAuthenticated middleware

// Mock the isAuthenticated middleware to always call next()
jest.mock('./utils/util', () => ({
	isAuthenticated: (req: Request, res: Response, next: Function) => next(),
}))

// Mock prisma client
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
		// Arrange: mock prisma.user.findUnique to return a user
		;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
			id: '123',
			name: 'Test User',
			email: 'test@example.com',
			partner: { id: 'partner123' },
		})

		// Act
		const res = await request(app)
			.get('/api/me')
			.set('Cookie', ['sessionId=valid-session'])

		// Assert
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({
			message: 'User found!',
			id: '123',
			name: 'Test User',
			email: 'test@example.com',
			partner: { id: 'partner123' },
		})
		expect(prisma.user.findUnique).toHaveBeenCalledWith({
			where: { id: undefined }, // Because req.session.user?.id is undefined in this test context
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
