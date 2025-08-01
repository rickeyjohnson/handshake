import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import session from 'express-session'
import expressWs from 'express-ws'
import prisma from './prismaClient'
import authRouter from './routes/auth'
import plaidRouter from './routes/plaid'
import pairRouter from './routes/pair'
import goalsRouter from './routes/goals'
import budgetsRouter from './routes/budgets'
import expensesRouter from './routes/expenses'
import { getPairedId, isAuthenticated } from './utils/util'
import { connectedClients } from './websocket/wsStore'

declare module 'express-session' {
	interface SessionData {
		user: {
			id: string
			name: string
			email: string
			partner_id?: string
			partner?: { id: string; name: string }
		}
	}
}

declare module 'express-serve-static-core' {
	interface Application {
		ws(path: string, handler: (ws: any, req: any) => void): Application
	}
}

export const app = express()
expressWs(app)

app.use(express.json())
app.use(cors())
app.use(
	session({
		name: 'sessionId',
		secret: 'keyboard cat', // update with env variable
		cookie: {
			maxAge: 1000 * 60 * 60,
			secure: false,
			httpOnly: false,
		},
		rolling: true,
		resave: false,
		saveUninitialized: false,
	})
)

app.use('/api/auth', authRouter)
app.use('/api/plaid', plaidRouter)
app.use('/api/pair', pairRouter)
app.use('/api/goals', goalsRouter)
app.use('/api/budgets', budgetsRouter)
app.use('/api/expenses', expensesRouter)

app.get('/api/', (req: Request, res: Response) => {
	res.send('Welcome to Handshake')
})

// Checks if an user is logged in
app.get('/api/me', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.session.user?.id },
			include: {
				partner: true,
			},
		})

		if (!user) {
			res.status(404).json({ message: 'User not found' })
		}

		req.session.user = user
		res.status(200).json({ message: 'User found!', ...user })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

// WEBSOCKET
app.ws('/', async (ws, req) => {
	console.log('WebSocket connected.')
	try {
		const userId = req.session?.user?.id || null

		if (userId) {
			let pair_id = null
			try {
				pair_id = await getPairedId(userId)
			} catch (e) {
				console.log(`No pair found for user ${userId}`)
			}

			connectedClients.push({
				ws: ws,
				user_id: userId,
				pair_id: pair_id,
			})
		}
	} catch (err) {
		console.error(err)
	}

	ws.on('close', () => {
		const index = connectedClients.findIndex((client) => client.ws === ws)
		if (index !== -1) connectedClients.splice(index, 1)
	})

	ws.on('message', async (message) => {
		try {
			const parsed = JSON.parse(message.toString())
			if (parsed.action === 'pair_update') {
				const userId = req.session?.user?.id
				if (!userId) return

				const newPairId = await getPairedId(userId)
				const client = connectedClients.find((c) => c.ws === ws)
				if (client) {
					client.pair_id = newPairId
					console.log(
						`Updated pair_id for user ${userId} to ${newPairId}`
					)
				}
			}
		} catch (e) {
			console.error('Error processing WS message:', e)
		}
	})
})
