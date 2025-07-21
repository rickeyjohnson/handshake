import request from 'supertest'
import express, { Express } from 'express'
import session from 'express-session'
import authRouter, { prisma } from '../../routes/auth'
import bcrypt from 'bcrypt'

// Mock Prisma client
jest.mock('../../generated/prisma', () => {
	return {
		PrismaClient: jest.fn().mockImplementation(() => ({
			user: {
				findUnique: jest.fn(),
				create: jest.fn(),
			},
		})),
	}
})

// Mock bcrypt
jest.mock('bcrypt', () => ({
	hash: jest.fn(),
	compare: jest.fn(),
}))

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
	app.use('/', authRouter)
})

afterEach(() => {
	jest.clearAllMocks()
})

describe('POST /signup', () => {
	it('should create a new user and return 201', async () => {
		const mockUser = {
			id: '1',
			name: 'Test',
			email: 'test@example.com',
			password: 'hashedpassword',
		}

		;(bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword')
		;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
		;(prisma.user.create as jest.Mock).mockResolvedValue(mockUser)

		const res = await request(app).post('/signup').send({
			name: 'Test',
			email: 'test@example.com',
			password: 'password123',
		})

		expect(res.statusCode).toBe(201)
		expect(res.body).toEqual(mockUser)
	})
})

describe('POST /login', () => {
	it('should return 200 for valid login', async () => {
		const mockUser = {
			id: '1',
			name: 'Test',
			email: 'test@example.com',
			password: 'hashedpassword',
			partner: null,
		}

		;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
		;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

		const res = await request(app).post('/login').send({
			email: 'test@example.com',
			password: 'password123',
		})

		expect(res.statusCode).toBe(200)
		expect(res.body).toEqual(mockUser)
	})

	it('should return 400 for invalid login', async () => {
		;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

		const res = await request(app).post('/login').send({
			email: 'wrong@example.com',
			password: 'wrongpassword',
		})

		expect(res.statusCode).toBe(400)
		expect(res.body.error).toMatch(/invalid/i)
	})
})

describe('POST /logout', () => {
	it('should destroy session and return success message', async () => {
		const res = await request(app).post('/logout')

		expect(res.statusCode).toBe(200)
		expect(res.body.message).toMatch(/logged out/i)
	})
})
