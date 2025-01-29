# Mocking

![mocking-me](./assets/are-you-mocking-me.gif)

## How do handle functions that rely on imported logic?

```typescript
import prisma from '@/libs/prisma';
import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import {
  IActorResponse,
  mapFetchActorAndFilms,
} from './helpers/actors/actor.mappers';

export const fetchActorById = async (args: Prisma.actorFindUniqueArgs) => {
  try {
    const response = (await prisma.actor.findUnique(
      args
    )) as unknown as IActorResponse;

    if (!response) {
      console.warn('Actor not found with ID:', args.where.actor_id);

      throw createError(404, 'Actor not found.');
    }

    return mapFetchActorAndFilms(response);
  } catch (error) {
    if (error instanceof createError.HttpError && error.status === 404) {
      throw error;
    }

    console.error('Error while fetching actor by ID:', error);
    throw createError(500, 'Failed to fetch actor. Please try again later.');
  }
};
```

The above function utilizes the Prisma ORM in order to get data from a db. Unless we run this as a integration test, testing will result in an error.  There is no access to a db.
But we don't want to run this as integration test, we want to focus on the business logic of the function.
Why test the Prisma logic?
We have already decided that we trust that library and find it reliable, which is why we are importing it into our code base.
Furthermore (and this is just my thought) we have no control over that logic.
If it is faulty, what can we do?  We can raise an issue and that's about it. 
I suppose we could fork the repo and fix the problem, but that would be absurd. Why take on that burden?

So we mock Prisma. We implement logic that says when the subject under test needs to import Prisma we provide a substitute in which we have absolute control.  We can monitor it and manufacture the return value. To reiterate, we trust Prisma.
Prisma has already been validated. It is our own business logic, the logic that we are responsible for developing, that needs to be validated.

Mocking is not the same as stubbing.  

```typescript
describe('getUserDetails function', () => {
  it('should return formatted user details using the provided stub', () => {
    // arrange
    const myStub = () => {
      return { id: 1, name: "John" }; // Stubbed return value
    };

    // act
    const result = getUserDetails(myStub);

    // assert
    expect(result).toBe('User: 1 - John'); // Verify that the stub result worked as expected
  });
});
```

Stubbing we are just replacing an imported function. Mocking is a stubbing but with the added value of a spy.  With `jest.fn()` you get both.  You can return a value, but you can also monitor the use of that function and make assertions accordingly.

```typescript
      expect(mockFetchAllActors).toHaveBeenCalledWith({
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
          _count: {
            select: {
              film_actor: true, // Counts the number of films associated with the actor
            },
          },
        },
      });
```

```typescript
import prisma from '../../../src/libs/prisma';
import {
  fetchActorById,
  fetchAllActors,
  IFetchAllActorsDto,
  addActor,
} from '../../../src/services/actor.service';

jest.mock('../../../src/libs/prisma', () => ({
  actor: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockFindUnique = prisma.actor.findUnique as jest.Mock;
const mockFindMany = prisma.actor.findMany as jest.Mock;
const mockCreate = prisma.actor.create as jest.Mock;
const mockUpdate = prisma.actor.update as jest.Mock;
const mockDelete = prisma.actor.delete as jest.Mock;
```
This might be a gross oversimplification, but the main take away from above is that in this unit test,
prisma.actor.findUnique does not exist. It is not real. Instead it is a function that we control.

```typescript
describe('fetch actor by id', () => {
  it('should an actor when given an id', async () => {
    mockFindUnique.mockResolvedValue({
      actor_id: 1,
      first_name: 'PENELOPE',
      last_name: 'GUINESS',
      film_actor: [
        {
          film: {
            film_id: 1,
            title: 'ACADEMY DINOSAUR',
          },
        },
        {
          film: {
            film_id: 23,
            title: 'ANACONDA CONFESSIONS',
          },
        },
        {
          film: {
            film_id: 25,
            title: 'ANGELS LIFE',
          },
        },
      ],
    });  // during this test the, we guarantee that invoking prisma.actor.findUnique will return the above object

    const expected = {
      actor_id: 1,
      first_name: 'PENELOPE',
      last_name: 'GUINESS',
      films: [
        {
          film_id: 1,
          title: 'ACADEMY DINOSAUR',
        },
        {
          film_id: 23,
          title: 'ANACONDA CONFESSIONS',
        },
        {
          film_id: 25,
          title: 'ANGELS LIFE',
        },
      ],
    };

    const actor = await fetchActorById({
      where: {
        actor_id: 1,
      },
      select: {
        actor_id: true,
        first_name: true,
        last_name: true,
        film_actor: {
          select: {
            film: {
              select: {
                film_id: true,
                title: true,
              },
            },
          },
        },
      },
    });
    expect(actor).toEqual(expected);
  });

  it('should return an error when there is an error fetching actors', async () => {
    mockFindUnique.mockRejectedValue(new Error('Test actor service error'));

    try {
      await fetchActorById({
        where: {
          actor_id: 1,
        },
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
          film_actor: {
            select: {
              film: {
                select: {
                  film_id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toMatchObject({
        message: 'Failed to fetch actor. Please try again later.',
        status: 500, // Added by `http-errors` library
        name: 'InternalServerError', // Indicates the specific error type
      });
    }
  });

  it('should return a 404 when given an id that does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    try {
      await fetchActorById({
        where: {
          actor_id: 1,
        },
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
          film_actor: {
            select: {
              film: {
                select: {
                  film_id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toMatchObject({
        message: 'Actor not found.',
        status: 404, // Added by `http-errors` library
        name: 'NotFoundError', // Indicates the specific error type
      });
    }
  });
});
```

Because we control the mock response the only real question is did we get the business logic right.
That business logic being the mapping function. But you might ask, "That mapper is imported.  Why not mock that?"
And it is true that it is being imported to file/function we are testing. But where is Prisma is code created by
another author, the mapper is ours. And if the tests fails, it is well within our obligation and ability to refactor the logic.
Again if Prisma fails, it might be our problem, but, abnormal efforts aside (or choosing a new ORM),
beyond our means to remedy.

