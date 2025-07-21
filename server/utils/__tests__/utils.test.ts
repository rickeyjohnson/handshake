import { PrismaClient } from '../../generated/prisma'
import { isAuthenticated, generateHandshakeCode, isExpired, getUserAccessToken, getItemIdsForUser, getItemInfo, simpleTransactionFromPlaidTransaction, getPairedId, addNewTransaction, modifyExistingTransactions, deleteExistingTransaction, saveCursorForItem, getTransactionsForUserOrPair, extractAccountDetails, getUserNameFromUserId, getAccountNameFromAccountId, setPlaidLinkToComplete, setPairedToComplete, getSpendingOnCategory, sendWebsocketMessage, formatCategory } from '../util';

const prisma = new PrismaClient()

jest.mock('../../generated/prisma', () => ({
  PrismaClient: jest.fn(() => ({
    $transaction: jest.fn(),
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    pair: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transactions: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    plaidItem: {
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    accounts: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe('isAuthenticated', () => {
  it('should return 401 if not authenticated', async () => {
    const req = { session: {} };
    const res = { status: jest.fn(), json: jest.fn() };
    await isAuthenticated(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'You must be logged in to perform this action. ' });
  });

  it('should call next function if authenticated', async () => {
    const req = { session: { user: {} } };
    const res = { status: jest.fn(), json: jest.fn() };
    const next = jest.fn();
    await isAuthenticated(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('generateHandshakeCode', () => {
  it('should generate a random code', () => {
    const code = generateHandshakeCode();
    expect(code).toHaveLength(5);
    expect(code).toMatch(/[A-Z0-9]/g);
  });
});

describe('isExpired', () => {
  it('should return true if date is expired', () => {
    const startDate = new Date('2022-01-01T00:00:00.000Z');
    const secondsToAdd = 3600;
    expect(isExpired(startDate, secondsToAdd)).toBe(true);
  });

  it('should return false if date is not expired', () => {
    const startDate = new Date('2022-01-01T00:00:00.000Z');
    const secondsToAdd = -3600;
    expect(isExpired(startDate, secondsToAdd)).toBe(false);
  });
});

describe('getUserAccessToken', () => {
  it('should return access token for user', async () => {
    const userId = '123';
    const accessToken = 'abc';
    const prisma = { plaidItem: { findFirst: jest.fn(() => ({ access_token: accessToken })) } };
    const result = await getUserAccessToken(userId);
    expect(result).toBe(accessToken);
  });
});

describe('getItemIdsForUser', () => {
  it('should return item ids for user', async () => {
    const userId = '123';
    const itemIds = ['item1', 'item2'];
    const prisma = { plaidItem: { findMany: jest.fn(() => itemIds) } };
    const result = await getItemIdsForUser(userId);
    expect(result).toEqual(itemIds);
  });
});

describe('getItemInfo', () => {
  it('should return item info for item id', async () => {
    const itemId = 'item1';
    const itemInfo = { name: 'Item 1' };
    const prisma = { plaidItem: { findUnique: jest.fn(() => itemInfo) } };
    const result = await getItemInfo(itemId);
    expect(result).toEqual(itemInfo);
  });
});

describe('simpleTransactionFromPlaidTransaction', () => {
  it('should return simple transaction object', () => {
    const txnObj = { transaction_id: 'txn1', account_id: 'account1', category: 'category1', date: '2022-01-01', authorized_date: '2022-01-02', name: 'Txn 1', amount: 100, currency_code: 'USD' };
    const userId = 'user1';
    const result = simpleTransactionFromPlaidTransaction(txnObj, userId);
    expect(result).toEqual({
      transaction_id: 'txn1',
      user_id: 'user1',
      account_id: 'account1',
      category: 'category1',
      date: '2022-01-01',
      authorized_date: '2022-01-02',
      name: 'Txn 1',
      amount: 100,
      currency_code: 'USD',
    });
  });
});

describe('getPairedId', () => {
  it('should return paired id for user', async () => {
    const userId = 'user1';
    const pairId = 'pair1';
    const prisma = { pair: { findFirst: jest.fn(() => ({ id: pairId })) } };
    const result = await getPairedId(userId);
    expect(result).toBe(pairId);
  });
});

describe('addNewTransaction', () => {
  it('should add new transaction', async () => {
    const transactionObj = { transaction_id: 'txn1', user_id: 'user1', account_id: 'account1', category: 'category1', date: '2022-01-01', authorized_date: '2022-01-02', name: 'Txn 1', amount: 100, currency_code: 'USD' };
    const prisma = { transactions: { create: jest.fn(() => ({ id: 'txn1' })) } };
    const result = await addNewTransaction(transactionObj);
    expect(result).toEqual({ id: 'txn1' });
  });
});

describe('modifyExistingTransactions', () => {
  it('should modify existing transaction', async () => {
    const transactionObj = { id: 'txn1', account_id: 'account1', category: 'category1', date: '2022-01-01', authorized_date: '2022-01-02', name: 'Txn 1', amount: 100, currency_code: 'USD' };
    const prisma = { transactions: { update: jest.fn(() => ({ id: 'txn1' })) } };
    const result = await modifyExistingTransactions(transactionObj);
    expect(result).toEqual({ id: 'txn1' });
  });
});

describe('deleteExistingTransaction', () => {
  it('should delete existing transaction', async () => {
    const transactionId = 'txn1';
    const prisma = { transactions: { update: jest.fn(() => ({ id: 'txn1-REMOVED-' + Math.random().toString(36).substr(2, 9) })) } };
    const result = await deleteExistingTransaction(transactionId);
    expect(result).toEqual({ id: 'txn1-REMOVED-' + Math.random().toString(36).substr(2, 9) });
  });
});

describe('saveCursorForItem', () => {
  it('should save cursor for item', async () => {
    const transactionCursor = 'cursor1';
    const itemId = 'item1';
    const prisma = { plaidItem: { update: jest.fn(() => ({ id: 'item1' })) } };
    await saveCursorForItem(transactionCursor, itemId);
    expect(prisma.plaidItem.update).toHaveBeenCalledTimes(1);
  });
});

describe('getTransactionsForUserOrPair', () => {
  it('should return transactions for user or pair', async () => {
    const id = 'user1';
    const maxNum = 10;
    const transactions = [{ id: 'txn1', user_id: 'user1', account_id: 'account1', category: 'category1', date: '2022-01-01', authorized_date: '2022-01-02', name: 'Txn 1', amount: 100, currency_code: 'USD' }];
    const prisma = { transactions: { findMany: jest.fn(() => transactions) } };
    const result = await getTransactionsForUserOrPair(id, maxNum);
    expect(result).toEqual(transactions);
  });
});

describe('extractAccountDetails', () => {
  it('should extract account details', async () => {
    const accounts = [{ account_id: 'account1', name: 'Account 1', subtype: 'subtype1', type: 'type1' }];
    const item = { institution_name: 'Institution 1' };
    const userId = 'user1';
    const result = await extractAccountDetails(accounts, item, userId);
    expect(result).toEqual([{ id: 'account1', account_name: 'Account 1', bank_name: 'Institution 1', user_id: 'user1', user_name: 'User 1', balances: { available: null, current: null, currency_code: null }, subtype: 'subtype1', type: 'type1' }]);
  });
});

describe('getUserNameFromUserId', () => {
  it('should return user name from user id', async () => {
    const userId = 'user1';
    const userName = 'User 1';
    const prisma = { user: { findUnique: jest.fn(() => ({ name: userName })) } };
    const result = await getUserNameFromUserId(userId);
    expect(result).toBe(userName);
  });
});

describe('getAccountNameFromAccountId', () => {
  it('should return account name from account id', async () => {
    const accountId = 'account1';
    const accountName = 'Account 1';
    const prisma = { accounts: { findUnique: jest.fn(() => ({ name: accountName })) } };
    const result = await getAccountNameFromAccountId(accountId);
    expect(result).toBe(accountName);
  });
});

describe('setPlaidLinkToComplete', () => {
  it('should set plaid link to complete', async () => {
    const userId = 'user1';
    const prisma = { user: { update: jest.fn(() => ({ id: 'user1' })) } };
    await setPlaidLinkToComplete(userId);
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
  });
});

describe('setPairedToComplete', () => {
  it('should set paired to complete', async () => {
    const userId = 'user1';
    const partnerId = 'partner1';
    const prisma = { user: { updateMany: jest.fn(() => ({ id: 'user1' })) } };
    await setPairedToComplete(userId, partnerId);
    expect(prisma.user.updateMany).toHaveBeenCalledTimes(1);
  });
});

describe('getSpendingOnCategory', () => {
  it('should return spending on category', async () => {
    const category = 'category1';
    const pairId = 'pair1';
    const spending = 100;
    const prisma = { transactions: { findMany: jest.fn(() => [{ amount: spending }]) } };
    const result = await getSpendingOnCategory(category, pairId);
    expect(result).toBe(spending);
  });
});

describe('sendWebsocketMessage', () => {
  it('should send websocket message', () => {
    const message = { action: 'action1', object: 'object1', user_id: 'user1', pair_id: 'pair1', content: 'content1' };
    const connectedClients = [jest.fn()];
    sendWebsocketMessage(message);
    expect(connectedClients[0]).toHaveBeenCalledTimes(1);
  });
});

describe('formatCategory', () => {
  it('should format category', () => {
    const category = 'category_1';
    const result = formatCategory(category);
    expect(result).toBe('Category 1');
  });
});