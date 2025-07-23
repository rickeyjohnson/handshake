import {
	generateHandshakeCode,
	isExpired,
	simpleTransactionFromPlaidTransaction,
	formatCategory,
} from '../util'

jest.mock('../../generated/prisma', () => {
	const { mockDeep } = require('jest-mock-extended')
	return {
		PrismaClient: jest.fn(() => mockDeep()),
	}
})

jest.mock('../util', () => {
	const actual = jest.requireActual('../util')
	return {
		...actual,
		prisma: {
			plaidItem: {
				findFirst: jest.fn(),
				findMany: jest.fn(),
				findUnique: jest.fn(),
			},
			pair: {
				findFirst: jest.fn(),
			},
		},
	}
})

describe('Utility Functions', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('generateHandshakeCode', () => {
		it('should return a 5-character alphanumeric code', () => {
			const code = generateHandshakeCode()
			expect(code).toHaveLength(5)
			expect(/^[A-Z0-9]{5}$/.test(code)).toBe(true)
		})
	})

	describe('isExpired', () => {
		it('should return true if time has passed', () => {
			const startDate = new Date(Date.now() - 10000).toISOString()
			expect(isExpired(startDate, 5)).toBe(true)
		})

		it('should return false if time has not passed', () => {
			const startDate = new Date().toISOString()
			expect(isExpired(startDate, 100)).toBe(false)
		})
	})

	describe('formatCategory', () => {
		it('should replace underscores with spaces', () => {
			expect(formatCategory('FOOD_AND_DRINK')).toBe('FOOD AND DRINK')
		})
	})

	describe('simpleTransactionFromPlaidTransaction', () => {
		it('should format a transaction object properly', () => {
			const txn = {
				transaction_id: 'txn_1',
				account_id: 'acc_1',
				personal_finance_category: { primary: 'FOOD' },
				date: '2023-01-01',
				authorized_date: '2023-01-01',
				merchant_name: null,
				name: 'Starbucks',
				amount: 4.5,
				iso_currency_code: 'USD',
				pending_transactions_id: null,
			}

			const result = simpleTransactionFromPlaidTransaction(txn, 'user_1')
			expect(result).toEqual({
				transaction_id: 'txn_1',
				user_id: 'user_1',
				account_id: 'acc_1',
				category: 'FOOD',
				date: '2023-01-01',
				authorized_date: '2023-01-01',
				name: 'Starbucks',
				amount: 4.5,
				currency_code: 'USD',
				pending_transactions_id: null,
			})
		})
	})
})
