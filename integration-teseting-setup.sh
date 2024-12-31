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
