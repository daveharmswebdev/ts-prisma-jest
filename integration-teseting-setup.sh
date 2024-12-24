#!/bin/bash

# Load environment variables from .env.test
source .env.test

# Echo the loaded environment variables
echo "DATABASE_URL=$DATABASE_URL"
echo "COMPOSE_PROJECT_NAME=$COMPOSE_PROJECT_NAME"

# Start the test Docker container
docker compose -f docker-compose.test.yml up -d

# Run Prisma migrations
DATABASE_URL=$DATABASE_URL npx prisma migrate deploy
