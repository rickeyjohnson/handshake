import { Router, Request, Response } from 'express'
import { PrismaClient } from '../generated/prisma'
import { getPairedId } from '../utils/util'

const goals = Router()
const prisma = new PrismaClient()

goals.get('/', async (req, res) => {
    try {
        const userId = req.session.user.id
        const pairId = await getPairedId(userId)
        const goals = await prisma.goals.findMany({
            where: { pair_id: pairId }
        })

        res.status(200).json(goals)
    } catch(error) {
        res.status(500).json({ error: error.message })
    }
})

goals.post('/', async (req, res) => {
    try {
        const userId = req.session.user.id
        const goal: {
            title: string
            description: string
            target: number
            current: number
            deadline: string

        } = req.body

        const newGoal = await prisma.goals.create({
            data: {
                user_id: userId,
                pair_id: await getPairedId(userId),
                title: goal.title,
                description: goal.description,
                target: goal.target,
                current: goal.current,
                deadline: new Date(goal.deadline),
            }
        })

        res.status(201).json({message: 'New goal created'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

export default goals