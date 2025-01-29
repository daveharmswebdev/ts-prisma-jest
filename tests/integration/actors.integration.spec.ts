import request from 'supertest'; // For making HTTP requests
// @ts-ignore
import { resetDatabase, truncate } from './truncate-and-seed';
// @ts-ignore
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

describe('POST /actors', () => {
  it('should create a new actor and return 201', async () => {
    // Define a valid actor payload
    const newActor = {
      first_name: 'Robert',
      last_name: 'Downey',
    };

    // Make the request to create the actor
    const response = await request(app).post('/actors').send(newActor);

    // Expect a 201 Created status
    expect(response.status).toBe(201);

    // Confirm the actor was created in the response
    expect(response.body).toMatchObject({
      data: {
        first_name: 'Robert',
        last_name: 'Downey',
      },
    });

    // Ensure additional data is returned (like the ID)
    expect(response.body.data.actor_id).toBeDefined();
    expect(new Date(response.body.data.last_update)).toBeInstanceOf(Date);
  });

  it('should return 400 for missing required fields', async () => {
    const invalidActor = { first_name: 'OnlyOneName' }; // Missing last_name
    const response = await request(app).post('/actors').send(invalidActor);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    const error = response.body.error.find((err: any) =>
      err.path.includes('last_name')
    );
    expect(error).toBeDefined();
    expect(error.message).toBe('Required');
  });

  it('should return 400 for invalid data types', async () => {
    // Invalid payload where fields are the wrong type
    const invalidActor = {
      first_name: 12345, // Should be a string
      last_name: false, // Should be a string
    };

    // Make the request
    const response = await request(app).post('/actors').send(invalidActor);

    // Expect a 400 Bad Request status
    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty('error');
    expect(Array.isArray(response.body.error)).toBe(true);

    const firstNameError = response.body.error.find((err: any) =>
      err.path.includes('first_name')
    );
    expect(firstNameError).toBeDefined();
    expect(firstNameError.message).toBe('Expected string, received number'); // Message for invalid type

    const lastNameError = response.body.error.find((err: any) =>
      err.path.includes('last_name')
    );
    expect(lastNameError).toBeDefined();
    expect(lastNameError.message).toBe('Expected string, received boolean'); // Message for invalid type
  });
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
    }
  });

  it('should return an empty array if no actors exist', async () => {
    // Undo the seeding
    await truncate();

    // Make a request to the /actors endpoint
    const response = await request(app).get('/actors');

    // Check the status code
    expect(response.status).toBe(200);

    // Check the response body is empty
    expect(response.body).toEqual([]);
  });
});
