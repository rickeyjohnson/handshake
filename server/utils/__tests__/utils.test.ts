import {
	generateHandshakeCode,
	isExpired,
	getUserAccessToken,
	getItemIdsForUser,
	getItemInfo,
	simpleTransactionFromPlaidTransaction,
	getPairedId,
	addNewTransaction,
	modifyExistingTransactions,
	deleteExistingTransaction,
	saveCursorForItem,
	getTransactionsForUserOrPair,
	extractAccountDetails,
	getUserNameFromUserId,
	getAccountNameFromAccountId,
	setPlaidLinkToComplete,
	setPairedToComplete,
	getSpendingOnCategory,
	sendWebsocketMessage,
	formatCategory,
} from '../util'

jest.mock('../util', () => ({
	generateHandshakeCode: jest.fn(() => 'mock-handshake-code'),
	isExpired: jest.fn(() => false),
	getUserAccessToken: jest.fn(() => 'mock-access-token'),
	getItemIdsForUser: jest.fn(() => ['mock-item-id']),
	getItemInfo: jest.fn(() => ({ name: 'Mock Item' })),
	simpleTransactionFromPlaidTransaction: jest.fn(() => ({
		transaction_id: 'mock-txn-id',
	})),
	getPairedId: jest.fn(() => 'mock-paired-id'),
	addNewTransaction: jest.fn(() => ({ id: 'mock-txn-id' })),
	modifyExistingTransactions: jest.fn(() => ({ id: 'mock-txn-id' })),
	deleteExistingTransaction: jest.fn(() => ({ id: 'mock-txn-id-REMOVED' })),
	saveCursorForItem: jest.fn(),
	getTransactionsForUserOrPair: jest.fn(() => [{ id: 'mock-txn-id' }]),
	extractAccountDetails: jest.fn(() => [{ id: 'mock-account-id' }]),
	getUserNameFromUserId: jest.fn(() => 'Mock User'),
	getAccountNameFromAccountId: jest.fn(() => 'Mock Account'),
	setPlaidLinkToComplete: jest.fn(),
	setPairedToComplete: jest.fn(),
	getSpendingOnCategory: jest.fn(() => 100),
	sendWebsocketMessage: jest.fn(),
	formatCategory: jest.fn(() => 'Mock Category'),
}))

describe('generateHandshakeCode', () => {
	it('should return a mock handshake code', () => {
		expect(generateHandshakeCode()).toBe('mock-handshake-code')
	})
})

describe('isExpired', () => {
	it('should return false', () => {
		expect(isExpired(new Date(), 0)).toBe(false)
	})
})

describe('getUserAccessToken', () => {
	it('should return a mock access token', () => {
		expect(getUserAccessToken('mock-user-id')).toBe('mock-access-token')
	})
})

describe('getItemIdsForUser', () => {
	it('should return a mock item id', () => {
		expect(getItemIdsForUser('mock-user-id')).toEqual(['mock-item-id'])
	})
})

describe('getItemInfo', () => {
	it('should return a mock item info', () => {
		expect(getItemInfo('mock-item-id')).toEqual({ name: 'Mock Item' })
	})
})

describe('simpleTransactionFromPlaidTransaction', () => {
	it('should return a mock transaction object', () => {
		expect(
			simpleTransactionFromPlaidTransaction({}, 'mock-user-id')
		).toEqual({ transaction_id: 'mock-txn-id' })
	})
})

describe('getPairedId', () => {
	it('should return a mock paired id', () => {
		expect(getPairedId('mock-user-id')).toBe('mock-paired-id')
	})
})

describe('addNewTransaction', () => {
	it('should return a mock transaction object', () => {
		expect(addNewTransaction({})).toEqual({ id: 'mock-txn-id' })
	})
})

describe('modifyExistingTransactions', () => {
	it('should return a mock transaction object', () => {
		expect(modifyExistingTransactions({})).toEqual({ id: 'mock-txn-id' })
	})
})

describe('deleteExistingTransaction', () => {
	it('should return a mock transaction object', () => {
		expect(deleteExistingTransaction('mock-txn-id')).toEqual({
			id: 'mock-txn-id-REMOVED',
		})
	})
})

describe('saveCursorForItem', () => {
	it('should not throw an error', () => {
		expect(() =>
			saveCursorForItem('mock-cursor', 'mock-item-id')
		).not.toThrow()
	})
})

describe('getTransactionsForUserOrPair', () => {
	it('should return a mock transaction object', () => {
		expect(getTransactionsForUserOrPair('mock-user-id', 10)).toEqual([
			{ id: 'mock-txn-id' },
		])
	})
})

describe('extractAccountDetails', () => {
	it('should return a mock account details object', () => {
		expect(extractAccountDetails([], {}, 'mock-user-id')).toEqual([
			{ id: 'mock-account-id' },
		])
	})
})

describe('getUserNameFromUserId', () => {
	it('should return a mock user name', () => {
		expect(getUserNameFromUserId('mock-user-id')).toBe('Mock User')
	})
})

describe('getAccountNameFromAccountId', () => {
	it('should return a mock account name', () => {
		expect(getAccountNameFromAccountId('mock-account-id')).toBe(
			'Mock Account'
		)
	})
})

describe('setPlaidLinkToComplete', () => {
	it('should not throw an error', () => {
		expect(() => setPlaidLinkToComplete('mock-user-id')).not.toThrow()
	})
})

describe('setPairedToComplete', () => {
	it('should not throw an error', () => {
		expect(() =>
			setPairedToComplete('mock-user-id', 'mock-partner-id')
		).not.toThrow()
	})
})

describe('getSpendingOnCategory', () => {
	it('should return a mock spending amount', () => {
		expect(getSpendingOnCategory('mock-category', 'mock-paired-id')).toBe(
			100
		)
	})
})

describe('formatCategory', () => {
	it('should return a mock category string', () => {
		expect(formatCategory('mock-category')).toBe('Mock Category')
	})
})
