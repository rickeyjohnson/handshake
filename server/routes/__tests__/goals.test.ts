import { getItemIdsForUser, getUserAccessToken, getItemInfo, getPairedId } from '../../utils/util'
import { PrismaClient } from '../../generated/prisma'

jest.mock('../../generated/prisma', () => {
  const mockItem = {
    access_token: 'access-sandbox-123',
    id: 'item1',
    institution_name: 'Bank',
  }

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      plaidItem: {
        findFirst: jest.fn().mockResolvedValue(mockItem),
        findMany: jest.fn().mockResolvedValue([{ id: 'item1' }, { id: 'item2' }]),
        findUnique: jest.fn().mockResolvedValue(mockItem),
      },
      pair: {
        findFirst: jest.fn().mockResolvedValue({ id: 'pair-789' }),
      },
    })),
  }
})

const prisma = new PrismaClient()

describe('Database Utility Functions', () => {
  describe('getUserAccessToken', () => {
    it('should return access_token from plaidItem', async () => {
      const result = await getUserAccessToken('user_123')
      expect(result).toBe('access-sandbox-123')
    })
  })

  describe('getItemIdsForUser', () => {
    it('should return array of items', async () => {
      const result = await getItemIdsForUser('user_456')
      expect(result).toEqual([{ id: 'item1' }, { id: 'item2' }])
    })
  })

  describe('getItemInfo', () => {
    it('should return item details', async () => {
      const result = await getItemInfo('item1')
      expect(result).toEqual({ id: 'item1', institution_name: 'Bank' })
    })
  })

  describe('getPairedId', () => {
    it('should return pair id', async () => {
      const result = await getPairedId('user_123')
      expect(result).toBe('pair-789')
    })
  })
})
