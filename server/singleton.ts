import { PrismaClient } from './generated/prisma'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prisma from './prismaClient'

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  // mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>