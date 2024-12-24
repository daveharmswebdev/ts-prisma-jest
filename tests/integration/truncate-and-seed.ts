import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function resetDatabase() {
  // Truncate all tables
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `;

  for (const table of tables) {
    if (table.tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${table.tablename}" RESTART IDENTITY CASCADE;`
      );
    }
  }

  console.log('Database truncated successfully.');

  // Seed the database
  await prisma.language.createMany({
    data: [{ name: 'English' }, { name: 'French' }],
  });

  await prisma.actor.createMany({
    data: [
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Smith' },
    ],
  });

  console.log('Database seeded successfully.');
}

export async function truncate() {
  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `;

  for (const table of tables) {
    if (table.tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${table.tablename}" RESTART IDENTITY CASCADE;`
      );
    }
  }

  console.log('Database truncated successfully.');
}
