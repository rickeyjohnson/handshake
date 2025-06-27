const auth = require('express').Router()
const rateLimit = require('express-rate-limit')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 1000,
	message: { error: 'Too many failed login attempts. Try again later.' },
})

auth.post('/signup', async (req, res) => {
	const { name, email, password } = req.body

	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ error: 'Name, email, and password are required.' })
	}

	if (password.length < 8) {
		return res
			.status(400)
			.json({ error: 'Password must be at least 8 characters long.' })
	}

	const existingUser = await prisma.user.findUnique({
		where: { email },
	})

	if (existingUser) {
		return res.status(400).json({ error: 'Email already taken.' })
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

auth.post('/login', loginLimiter, async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res
			.status(400)
			.json({ error: 'Email and password are required' })
	}

	const user = await prisma.user.findUnique({
		where: { email },
	})

	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(400).json({ error: 'Invalid email or password ' })
	}

	req.session.user = user
	res.status(200).json(user)
})

auth.post('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			return res.status(500).json({ error: 'Failed to log out' })
		}

		res.clearCookie('connect.sid')
		res.json({ message: 'Logged out successfully' })
	})
})

module.exports = auth
