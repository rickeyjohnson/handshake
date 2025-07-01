const express = require('express')
const cors = require('cors')
const session = require('express-session')
const app = express()
const { PrismaClient } = require('./generated/prisma')
const prisma = new PrismaClient()
const PORT = process.env.PORT | 3000
const authRouter = require('./routes/auth.js')
const plaidRouter = require('./routes/plaid.js')
const pairRouter = require('./routes/pair.js')
const { isAuthenticated } = require('./utils/util.js')

app.use(express.json())
app.use(cors(
	{
		origin: 'http://localhost:5173',
		credentials: true,
	}
))
app.use(
	session({
		name: 'sessionId',
		secret: 'keyboard cat', // update with env variable
		cookie: {
			maxAge: 1000 * 60 * 60,
			secure: false,
			httpOnly: false,
		},
		resave: false,
		saveUninitialized: false,
	})
)

app.use('/api/auth', authRouter)
app.use('/api/plaid', plaidRouter)
app.use('/api/pair', pairRouter)

app.get('/api/', (req, res) => {
	res.send('Welcome to Handshake')
})

// Checks if an user is logged in
app.get('/api/me', isAuthenticated, async (req, res) => {
	try {
		let user = null
		if (req.session.user) {
			user = await prisma.user.findUnique({
				where: { id: req.session.user.id },
			})
		}

		if (!user) {
			throw new Error('Unauthorized, not allowed')
		}

		const { id, name, email } = user
		res.status(200).json({ id, name, email})
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
