// /api/plaid/
import { Router } from 'express'
import { PrismaClient } from '../generated/prisma'
import {
	Configuration,
	CountryCode,
	LinkTokenCreateRequest,
	PlaidApi,
	PlaidEnvironments,
	Products,
} from 'plaid'
import {
	addNewTransaction,
	deleteExistingTransaction,
	extractAccountDetails,
	getItemIdsForUser,
	getItemInfo,
	getPairedId,
	getTransactionsForUserOrPair,
	getUserAccessToken,
	isAuthenticated,
	modifyExistingTransactions,
	saveCursorForItem,
	setPlaidLinkToComplete,
	simpleTransactionFromPlaidTransaction,
} from '../utils/util'

const plaid = Router()
const prisma = new PrismaClient()

const PLAID_CLIENT_ID: string = process.env.PLAID_CLIENT_ID || 'unknown'
const PLAID_SECRET: string = process.env.PLAID_SECRET || 'unknown'
const PLAID_ENV: string = process.env.PLAID_ENV || 'sandbox'
const PLAID_PRODUCTS: Products[] = [Products.Auth, Products.Transactions]
const PLAID_COUNTRY_CODES: CountryCode[] = [CountryCode.Us]
const PLAID_REDIRECT_URI: string = process.env.PLAID_REDIRECT_URI || ''

const configuration = new Configuration({
	basePath: PlaidEnvironments[PLAID_ENV],
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': PLAID_SECRET,
		},
	},
})

const plaidClient = new PlaidApi(configuration)

// CREATE PLAID LINK TOKEN
plaid.post('/create_link_token', isAuthenticated, async (req, res) => {
	const clientUserId = req.session.user.id
	const linkTokenCreateRequest: LinkTokenCreateRequest = {
		user: {
			client_user_id: clientUserId,
		},
		client_name: 'Handshake',
		products: PLAID_PRODUCTS,
		country_codes: PLAID_COUNTRY_CODES,
		redirect_uri: PLAID_REDIRECT_URI,
		language: 'en',
	}

	try {
		const createTokenResponse = await plaidClient.linkTokenCreate(
			linkTokenCreateRequest
		)
		res.status(200).json(createTokenResponse.data)
	} catch (error) {
		res.status(500).json({
			error: error.message,
			message: 'this is failing',
		})
	}
})

plaid.post('/exchange_public_token', isAuthenticated, async (req, res) => {
	const userId = req.session.user.id
	const publicToken = req.body.public_token

	try {
		const exchangeTokenResponse = await plaidClient.itemPublicTokenExchange(
			{
				public_token: publicToken,
			}
		)

		const accessToken = exchangeTokenResponse.data.access_token
		const itemId = exchangeTokenResponse.data.item_id

		const createPlaidItem = await prisma.plaidItem.create({
			data: {
				id: itemId,
				access_token: accessToken,
				owner_id: userId,
			},
		})

		await populateBankName(itemId, accessToken)
		await populateAccountNames(userId, accessToken)
		await setPlaidLinkToComplete(userId)

		res.status(200).json({ public_token_exchange: 'complete' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// PLAID API ENDPOINTS FOR FETCHING BANK DATA
const syncTransactions = async (item_id) => {
	const {
		access_token: accessToken,
		transaction_cursor: transactionCursor,
		owner_id: userId,
	} = await getItemInfo(item_id)
	const allData = await fetchNewSyncData(accessToken, transactionCursor)

	await Promise.all(
		allData.added.map(async (txnObj) => {
			const simpleTransaction = simpleTransactionFromPlaidTransaction(
				txnObj,
				userId
			)
			console.log(simpleTransaction)
			await addNewTransaction(simpleTransaction)
		})
	)

	await Promise.all(
		allData.modified.map(async (txnObj) => {
			const simpleTransaction = simpleTransactionFromPlaidTransaction(
				txnObj,
				userId
			)
			console.log(simpleTransaction)
			await modifyExistingTransactions(simpleTransaction)
		})
	)

	await Promise.all(
		allData.removed.map(async (txnObj) => {
			await deleteExistingTransaction(txnObj.transaction_id)
		})
	)

	await saveCursorForItem(allData.nextCursor, item_id)
}

const fetchNewSyncData = async (accessToken, initialCursor) => {
	let keepGoing = false
	const allData = {
		added: [],
		modified: [],
		removed: [],
		nextCursor: initialCursor,
	}

	do {
		const results = await plaidClient.transactionsSync({
			access_token: accessToken,
			cursor: allData.nextCursor,
			options: {
				include_personal_finance_category: true,
			},
		})
		const newData = results.data
		allData.added = allData.added.concat(newData.added)
		allData.modified = allData.modified.concat(newData.modified)
		allData.removed = allData.removed.concat(newData.removed)
		allData.nextCursor = newData.next_cursor
		keepGoing = newData.has_more
	} while (keepGoing === true)

	console.log(allData)
	return allData
}

const populateBankName = async (itemId, accessToken) => {
	try {
		const itemResponse = await plaidClient.itemGet({
			access_token: accessToken,
		})
		const institutionId = itemResponse.data.item.institution_id

		if (!institutionId) {
			return
		}

		const institutionResponse = await plaidClient.institutionsGetById({
			institution_id: institutionId,
			country_codes: PLAID_COUNTRY_CODES,
		})
		const institutionName = institutionResponse.data.institution.name

		await prisma.plaidItem.update({
			where: { id: itemId },
			data: {
				bank: institutionName,
			},
		})
	} catch (error) {
		console.log(
			`Ran into error populating bank name! ${JSON.stringify(error)}`
		)
	}
}

const populateAccountNames = async (userId, accessToken) => {
	try {
		const acctsResponse = await plaidClient.accountsGet({
			access_token: accessToken,
		})
		const acctData = acctsResponse.data
		const itemId = acctData.item.item_id
		await Promise.all(
			acctData.accounts.map(async (acct) => {
				await prisma.accounts.create({
					data: {
						user_id: userId,
						id: acct.account_id,
						item_id: itemId,
						name: acct.name,
					},
				})
			})
		)
	} catch (error) {
		console.log(
			`Ran into error populating bank name! ${JSON.stringify(error)}`
		)
	}
}

plaid.get('/accounts/get', isAuthenticated, async (req, res) => {
	const userId = req.session.user.id
	const partnerId = req.session.user.partner_id

	try {
		const accessToken = await getUserAccessToken(userId)
		const partnerAccessToken = await getUserAccessToken(partnerId)

		const accountsResponse = await plaidClient.accountsGet({
			access_token: accessToken,
		})
		const partnerAccountsResponse = await plaidClient.accountsGet({
			access_token: partnerAccessToken,
		})

		const userAccount = await extractAccountDetails(
			accountsResponse.data.accounts,
			accountsResponse.data.item,
			userId
		)
		const partnerAccount = await extractAccountDetails(
			partnerAccountsResponse.data.accounts,
			partnerAccountsResponse.data.item,
			partnerId
		)
		const accounts = [...userAccount, ...partnerAccount]

		res.status(200).json(accounts)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

plaid.get('/transactions/sync', isAuthenticated, async (req, res) => {
	try {
		const userId = req.session.user.id
		const items = await getItemIdsForUser(userId)

		const fullResults = await Promise.all(
			items.map(async (item) => {
				return await syncTransactions(item.id)
			})
		)
		res.status(200).json({ completedResults: fullResults })
	} catch (error) {
		console.log('Running into an error!')
		res.status(500).json({ error: error.message })
	}
})

plaid.get('/transactions/list', isAuthenticated, async (req, res) => {
	try {
		const userId = req.session.user.id
		const pairId = getPairedId(userId)
		const maxCount = 100
		const transactions = await getTransactionsForUserOrPair(
			pairId,
			maxCount
		)

		res.status(200).json(transactions)
	} catch (error) {
		console.log(`Error fetching transactions ${JSON.stringify(error)}`)
		res.status(500).json({ error: error.message })
	}
})

export default plaid
