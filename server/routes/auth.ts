import { Router, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../generated/prisma'

const auth = Router()
const prisma = new PrismaClient()

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 1000,
	message: { error: 'Too many failed login attempts. Try again later.' },
})

auth.post('/signup', async (req: Request, res: Response) => {
	const {
		name,
		email,
		password,
	}: { name: string; email: string; password: string } = req.body

	if (!name || !email || !password) {
		res.status(400).json({
			error: 'Name, email, and password are required.',
		})
		return
	}

	if (password.length < 8) {
		res.status(400).json({
			error: 'Password must be at least 8 characters long.',
		})
		return
	}

	const existingUser = await prisma.user.findUnique({
		where: { email },
	})

	if (existingUser) {
		res.status(400).json({ error: 'Email already taken.' })
		return
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10)
		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		})

		req.session.user = newUser
		res.status(201).json(newUser)
	} catch (error) {
		console.error('Error creating post: ', error)
		res.status(500).json({
			error: 'Something went wrong while creating the post.',
		})
	}
})

auth.post('/login', loginLimiter, async (req: Request, res: Response) => {
	const { email, password }: { email: string; password: string } = req.body

	if (!email || !password) {
		res.status(400).json({ error: 'Email and password are required' })
		return
	}

	const user = await prisma.user.findUnique({
		where: { email },
	})

	if (!user || !(await bcrypt.compare(password, user.password))) {
		res.status(400).json({ error: 'Invalid email or password ' })
		return
	}

	req.session.user = user
	res.status(200).json(user)
})

auth.post('/logout', (req: Request, res: Response) => {
	req.session.destroy((error: Error) => {
		if (error) {
			res.status(500).json({ error: 'Failed to log out' })
			return
		}

		res.clearCookie('connect.sid')
		res.json({ message: 'Logged out successfully' })
	})
})

export default auth
