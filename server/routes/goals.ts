import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { getPairedId, sendWebsocketMessage } from '../utils/util'
import { connectedClients } from '../websocket/wsStore'

const goals = Router()
const prisma = new PrismaClient()

goals.get('/', async (req, res) => {
	try {
		const userId = req.session.user.id
		const pairId = await getPairedId(userId)
		const goals = await prisma.goals.findMany({
			where: { pair_id: pairId },
		})

		res.status(200).json(goals)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

goals.get('/details/:id', async (req, res) => {
	try {
		const goalId = req.params.id
		const goal = await prisma.goals.findUnique({
			where: { id: goalId },
			include: {
				user: true,
				contributions: true,
			},
		})

		res.status(200).json(goal)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

goals.post('/', async (req, res) => {
	try {
		const userId = req.session.user.id
		const pairId = await getPairedId(userId)
		const goal: {
			title: string
			description: string
			target: string
			deadline: string
		} = req.body

		const newGoal = await prisma.goals.create({
			data: {
				user_id: userId,
				pair_id: pairId,
				title: goal.title,
				description: goal.description,
				target: parseFloat(goal.target),
				current: 0,
				deadline: new Date(goal.deadline),
			},
		})

		sendWebsocketMessage({
			action: 'ADD',
			object: 'goal',
			user_id: userId,
			pair_id: pairId,
			content: null,
		})

		res.status(201).json({ message: 'New goal created' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

goals.delete('/', async (req, res) => {
	try {
		const { goalId } = req.body
		const deletedGoal = await prisma.goals.delete({
			where: { id: goalId },
		})
		res.status(204).json({ message: 'Goal successfully deleted' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

goals.get('/contributions/', async (req, res) => {
	try {
		const { goalId } = req.body
		const contributions = await prisma.goalContributions.findMany({
			where: { goal_id: goalId },
		})
		res.status(200).json(contributions)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

goals.post('/contributions/', async (req, res) => {
	try {
		const { goalId, amount, date } = req.body
		const userId = req.session.user.id

		const newContribution = await prisma.goalContributions.create({
			data: {
				goal_id: goalId,
				user_id: userId,
				amount: amount,
				posted_date: new Date(date),
			},
		})

		res.status(200).json({ message: 'New goal contribution added' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

goals.delete('/contributions/', async (req, res) => {
	try {
		const { contributionId } = req.body

		const deletedContribution = await prisma.goalContributions.delete({
			where: { id: contributionId },
		})

		res.status(200).json({ message: 'New goal contribution added' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

export default goals
