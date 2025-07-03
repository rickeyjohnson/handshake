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

export const simpleTransactionFromPlaidTransaction = (txnObj, userId) => {
	return {
		transaction_id: txnObj.transaction_id,
		user_id: userId,
		account_id: txnObj.account_id,
		category: txnObj.personal_finance_category.primary,
		date: txnObj.date,
		authorized_date: txnObj.authorized_date,
		name: txnObj.merchant_name ?? txnObj.name,
		amount: txnObj.amount,
		currency_code: txnObj.iso_currency_code,
		pending_transactions_id: txnObj.pending_transactions_id,
	}
}

export const getPairedId = async (user_id) => {
	const pair = await prisma.pair.findFirst({
		where: {
			OR: [{ user1_id: user_id }, { user2_id: user_id }],
		},
	})

	return pair.id
}

export const addNewTransaction = async (transactionObj) => {
	try {
		const userId = transactionObj.user_id
		const pairId = await getPairedId(userId)
		const newTransaction = await prisma.transactions.create({
			data: {
				id: transactionObj.transaction_id,
				user_id: userId,
				pair_id: pairId,
				account_id: transactionObj.account_id,
				category: transactionObj.category,
				date: transactionObj.date,
				authorized_date: transactionObj.authorized_date,
				name: transactionObj.name,
				amount: transactionObj.amount,
				currency_code: transactionObj.currency_code,
			},
		})

		return newTransaction
	} catch (error) {
		console.error(error)
	}
}

export const modifyExistingTransactions = async (transactionObj) => {
	try {
		const updatedTransaction = await prisma.transactions.update({
			where: { id: transactionObj.id },
			data: {
				account_id: transactionObj.account_id,
				category: transactionObj.category,
				date: transactionObj.date,
				authorized_date: transactionObj.authorized_date,
				name: transactionObj.name,
				amount: transactionObj.amount,
				currency_code: transactionObj.currency_code,
			},
		})

		return updatedTransaction
	} catch (error) {
		console.error(error)
	}
}