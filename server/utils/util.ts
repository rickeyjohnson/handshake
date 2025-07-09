import { randomUUID } from 'crypto'
import { PrismaClient } from '../generated/prisma'
import { format } from 'date-fns'

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
	const item = await prisma.plaidItem.findFirst({
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

export const deleteExistingTransaction = async (transaction_id) => {
	try {
		const updatedId = transaction_id + '-REMOVED-' + randomUUID()
		const result = await prisma.transactions.update({
			where: { id: transaction_id },
			data: {
				id: updatedId,
				is_removed: true,
			},
		})
		return result
	} catch (error) {
		console.error(error)
	}
}

export const saveCursorForItem = async (transactionCursor, itemId) => {
	try {
		await prisma.plaidItem.update({
			where: { id: itemId },
			data: {
				transaction_cursor: transactionCursor,
			},
		})
	} catch (error) {
		console.log(`I can't save the cursor ${JSON.stringify(error)}`)
	}
}

export const getTransactionsForUserOrPair = async (id, max_num) => {
	const transactions = await prisma.transactions.findMany({
		where: { user_id: id, is_removed: false },
		include: {
			account: {
				select: {
					name: true,
					item: {
						select: {
							bank: true,
						},
					},
				},
			},
			user: {
				select: {
					name: true,
				},
			},
		},
		orderBy: [{ authorized_date: 'desc' }],
		take: max_num,
	})

	const customTransactions = transactions.map((tx) => ({
		id: tx.id,
		user_id: tx.user_id,
		user_name: tx.user.name,
		account_id: tx.account_id,
		account_name: tx.account.name,
		bank_name: tx.account.item.bank,
		category: tx.category,
		date: tx.date,
		authorized_date: tx.authorized_date,
		transaction_name: tx.name,
		amount: tx.amount,
		currency_code: tx.currency_code,
		is_removed: tx.is_removed,
	}))

	return customTransactions
}

export const extractAccountDetails = async (accounts, item, userId) => {
	const name = await getUserNameFromUserId(userId)
	const customAccounts = accounts.map((acc) => ({
		id: acc.account_id,
		account_name: acc.name,
		bank_name: item.institution_name,
		user_id: userId,
		user_name: name,
		balances: {
			available: acc.balances.available,
			current: acc.balances.current,
			currency_code: acc.balances.iso_currency_code,
		},
		subtype: acc.subtype,
		type: acc.type,
	}))

	return customAccounts
}

export const getUserNameFromUserId = async (user_id) => {
	const user = await prisma.user.findUnique({
		where: { id: user_id },
		select: {
			name: true,
		},
	})

	return user.name
}

export const getAccountNameFromAccountId = async (account_id) => {
	const account = await prisma.accounts.findUnique({
		where: { id: account_id },
		select: {
			name: true,
		},
	})

	return account.name
}

export const setPlaidLinkToComplete = async (user_id) => {
	await prisma.user.update({
		where: { id: user_id },
		data: {
			is_plaid_linked: true,
		},
	})
}

export const setPairedToComplete = async (user_id, partner_id) => {
	await prisma.user.updateMany({
		where: {
			OR: [{ id: user_id }, { id: partner_id }],
		},
		data: {
			is_paired: true,
		},
	})
}

export const getSpendingOnCategory = async (category: string, pairId: string) => {
	const now = new Date()

	const startOfMonth = format(
		new Date(now.getFullYear(), now.getMonth(), 1),
		'yyyy-MM-dd'
	)
	const startOfNextMonth = format(
		new Date(now.getFullYear(), now.getMonth() + 1, 1),
		'yyyy-MM-dd'
	)

	console.log(startOfMonth)
	console.log(startOfNextMonth)

	try {
		const data = await prisma.transactions.findMany({
			where: {
				category: category,
				pair_id: pairId,
				authorized_date: {
					gte: startOfMonth,
					lte: startOfNextMonth,
				},
			},
			select: {
				amount: true
			}
		})

		const amount = data.reduce<number>((sum, current) => sum - current.amount, 0)
		
		console.log(amount)

		return amount
	} catch (error) {
		console.error('Error fetching data for current month:', error)
		throw error
	}
}