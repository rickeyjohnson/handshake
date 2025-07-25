import { PrismaClient } from './generated/prisma'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prisma from './prismaClient'

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>