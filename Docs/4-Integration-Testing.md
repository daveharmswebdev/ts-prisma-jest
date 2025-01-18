# Integration Testing

Integration Testing tests the interaction between multiple components (e.g., modules, services, APIs, DBs) to verify they work together as expected within the system.

```ts
import request from 'supertest'; // For making HTTP requests
// @ts-ignore
import { resetDatabase, truncate } from './truncate-and-seed';
// @ts-ignore
import { disconnectPrisma } from './disconnectPrisma';
import app from '../../src/app'; // Your Express app (or the equivalent for your server)

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

## Plan
We are going to call the actors route and test that we get the expected response.
What can we control?
Even though we are not mocking we can still control the data.
We just need to create the db that the app is using.

## Challenges

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
