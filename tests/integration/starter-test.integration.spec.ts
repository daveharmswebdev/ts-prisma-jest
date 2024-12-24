import request from 'supertest'; // For making HTTP requests
import { resetDatabase, truncate } from './truncate-and-seed';
import { disconnectPrisma } from './disconnectPrisma';
import app from '../../src/app'; // Your Express app (or the equivalent for your server)

// Run this before each test to reset the database
beforeEach(async () => {
  await resetDatabase();
});

// Disconnect Prisma after all tests
afterAll(async () => {
  await disconnectPrisma();
});

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
      expect(
        new Date(actors[i].last_update).toISOString().split('T')[0]
      ).toEqual(
        new Date().toISOString().split('T')[0] // Compare only the date part
      );
    }
  });

  it('should return an empty array if no actors exist', async () => {
    // Reset database without seeding
    await truncate();

    // Make a request to the /actors endpoint
    const response = await request(app).get('/actors');

    // Check the status code
    expect(response.status).toBe(200);

    // Check the response body is empty
    expect(response.body).toEqual([]);
  });
});
