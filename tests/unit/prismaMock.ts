import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

jest.mock('../../src/libs/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(), // Deeply mock PrismaClient
}));

const prismaMock = jest.requireMock('../../src/libs/prisma')
  .default as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock); // Ensure a clean slate for each test
});

export { prismaMock };
