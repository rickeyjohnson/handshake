import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import session from 'express-session'
import expressWs from 'express-ws'
import { PrismaClient } from './generated/prisma'
import authRouter from './routes/auth'
import plaidRouter from './routes/plaid'
import pairRouter from './routes/pair'
import { isAuthenticated } from './utils/util'
import { connectedClients } from './websocket/wsStore'

declare module 'express-session' {
	interface SessionData {
		user: {
			id: string
			name: string
			email: string
			plaidToken: string
			partnerId: string
		}
	}
}

declare module 'express-serve-static-core' {
	interface Application {
		ws(path: string, handler: (ws: any, req: any) => void): Application
	}
}

const app = express()
expressWs(app)
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

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

app.get('/api/', (req: Request, res: Response) => {
	res.send('Welcome to Handshake')
})

// Checks if an user is logged in
app.get('/api/me', isAuthenticated, async (req: Request, res: Response) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.session.user?.id },
		})

		if (!user) {
			res.status(404).json({ message: 'User not found' })
		}

		res.status(200).json({ message: 'User found!', ...user })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

// WEBSOCKET
app.ws('/', (ws, req) => {
	console.log('WebSocket connected.')
	connectedClients.push(ws)

	ws.on('close', () => {
		const index = connectedClients.indexOf(ws)
		if (index !== -1) connectedClients.splice(index, 1)
		console.log('WebSocket closed.')
	})
})

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
