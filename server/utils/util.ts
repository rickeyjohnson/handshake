import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

export const isAuthenticated = (req, res, next) => {
	if (!req.session.user) {
		return res
			.status(401)
			.json({ error: 'You must be logged in to perform this action. ' })
	}

	next()
}

export const generateHandshakeCode = () => {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	let result = ''
	const codeLength = 5

	for (let i = 0; i < codeLength; i++) {
		const randomIndex = Math.floor(Math.random() * letters.length)
		result += letters.charAt(randomIndex)
	}

	return result
}

export const isExpired = (startDate, secondsToAdd) => {
	const date = new Date(startDate)
	const now = new Date()

	date.setSeconds(date.getSeconds() + secondsToAdd)

	return now > date
}

export const getUserAccessToken = async (user_id) => {
	const item = await prisma.plaidItem.findUnique({
		where: { owner_id: user_id },
	})

	return item.access_token
}

export const getItemIdsForUser = async (userId) => {
	const items = await prisma.plaidItem.findMany({
		where: { owner_id: userId },
	})
	return items
}

export const getItemInfo = async (itemId) => {
	const item = await prisma.plaidItem.findUnique({
		where: { id: itemId },
	})

	return item
}
