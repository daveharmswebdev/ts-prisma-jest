import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function disconnectPrisma() {
  await prisma.$disconnect();
}
