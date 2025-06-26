import express from 'express'
import cors from 'cors'
import session from 'express-session'
const app = express()
import { PrismaClient } from './generated/prisma'
const prisma = new PrismaClient()
const port = 3000

import authRouter from './routes/auth.ts'

app.use(express.json())
app.use(cors())
app.use(
	session({
		name: 'sessionId',
		secret: 'keyboard cat', // update with env variable
		cookie: {
			maxAge: 1000 * 60 * 3,
			secure: false,
			httpOnly: false,
		},
		resave: false,
		saveUninitialized: false,
	})
)

app.use('/api/auth', authRouter)

app.get('/api/', (req, res) => {
	res.send('Welcome to Handshake')
})

// Checks if an user is logged in
app.get('/api/me', async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.session.user.id },
		})

		if (!user) {
			throw new Error('Unauthorized')
		}

		res.status(200).json(user)
	} catch (error) {
		res.status(401).json({ error: error.message })
	}
})

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
