# Integration Testing

Integration Testing tests the interaction between multiple components (e.g., modules, services, APIs, DBs) to verify they work together as expected within the system.

They should be few, but meaningful.  In this app we want to test the chain of the controller through the middleware and to the db and back.

```ts
import request from 'supertest'; // For making HTTP requests
// @ts-ignore
import { resetDatabase, truncate } from './truncate-and-seed';
// @ts-ignore
import { disconnectPrisma } from './disconnectPrisma';
import app from '../../src/app';

describe('GET /actors', () => {
  it('should return all actors', async () => {
    // Make a request to the /actors endpoint
    const response = await request(app).get('/actors');

    // Check the status code
    expect(response.status).toBe(200);

    const actors = response.body;

    // Expected data
    const expectedActors = [
      { actor_id: 1, first_name: 'John', last_name: 'Doe' },
      { actor_id: 2, first_name: 'Jane', last_name: 'Smith' },
    ];

    // Test each actor individually
    for (let i = 0; i < actors.length; i++) {
      expect(actors[i]).toMatchObject(expectedActors[i]); // Check id, first_name, last_name
      expect(new Date(actors[i].last_update)).toBeInstanceOf(Date); // Ensure it's a valid date
    }
  });
});
```

Unlike unit testing there is no mocking.  We are literally importing and using the app file.

## Plan
We are going to call the actors route and test that we get the expected response.
What can we control?
Even though we are not mocking we can still control the data.
We just need to create the db that the app is using.

## Challenges

If test against a dev, UAT, or Prod database we will have problems.  You lose control of so many variables. If your test fail you can't say for certain that the issue isn't data related.

You would then be forced to right simplistic tests that tests nothing, like the value returned is a 200.

My solution is to create a minimalistic, dockerized db on the fly just for the integration test.  Furthermore truncate and seed between tests, reducing bad data doubts as much as possible.

### Script

```json
{
  "scripts": {
    "integration-testing:setup": "./integration-teseting-setup.sh",
    "integration-testing:teardown": "docker compose -f docker-compose.test.yml down",
    "integration-test": "npm run integration-testing:setup && jest --config jest.integration.config.js || true && npm run integration-testing:teardown"
  }
}
```

### Set Up

```text
#!/bin/bash

# Load environment variables from .env.test
source .env.test

# Echo the loaded environment variables
echo "DATABASE_URL=$DATABASE_URL"
echo "COMPOSE_PROJECT_NAME=$COMPOSE_PROJECT_NAME"

# Start the test Docker container
docker compose -f docker-compose.test.yml up -d

# Wait for the database to be ready using `pg_isready`
echo "Waiting for the database to be ready..."
RETRIES=10
until pg_isready -h localhost -p 5433 -U postgres; do
  RETRIES=$((RETRIES-1))
  if [[ $RETRIES -le 0 ]]; then
    echo "Error: Database is not ready after multiple attempts."
    docker compose -f docker-compose.test.yml logs pagila-postgres-prisma-test
    exit 1
  fi
  sleep 2
done

# Run Prisma migrations to set up the database schema
echo "Running Prisma migrations..."
DATABASE_URL=$DATABASE_URL npx prisma migrate deploy
```

### Note

`COMPOSE_PROJECT_NAME=test` Is important to avoid conflicts that come from indiscriminately naming containers and container projects.  Learned the hard way.

## Truncate and Seed

```typescript
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
```

## Before Each

```typescript
// Run this before each test to reset the database
beforeEach(async () => {
  await resetDatabase();
});
```

The before each is a lifecycle hook that you place in your describe block that your tests, designated by 'it' will execute, before it runs.
