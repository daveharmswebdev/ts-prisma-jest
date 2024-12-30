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

describe('ActorService', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetch all actors', () => {
    it('should return all actors', async () => {
      mockFindMany.mockResolvedValue([
        {
          actor_id: 128,
          first_name: 'CATE',
          last_name: 'MCQUEEN',
          _count: {
            film_actor: 30,
          },
        },
        {
          actor_id: 27,
          first_name: 'JULIA',
          last_name: 'MCQUEEN',
          _count: {
            film_actor: 33,
          },
        },
      ]);

      const expected = [
        {
          actor_id: 128,
          first_name: 'CATE',
          last_name: 'MCQUEEN',
          totalFilms: 30,
        },
        {
          actor_id: 27,
          first_name: 'JULIA',
          last_name: 'MCQUEEN',
          totalFilms: 33,
        },
      ];

      const actors = await fetchAllActors({
        where: {
          OR: [
            {
              first_name: {
                contains: 'mcq',
                mode: 'insensitive',
              },
            },
            {
              last_name: {
                contains: 'mcq',
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
          _count: {
            select: {
              film_actor: true,
            },
          },
        },
      });

      expect(actors).toEqual(expected);
    });

    it('should return an empty array when there are no actors', async () => {
      mockFindMany.mockResolvedValue([]);

      const expected: IFetchAllActorsDto[] = [];

      const actors = await fetchAllActors({
        where: {
          OR: [
            {
              first_name: {
                contains: 'mcq',
                mode: 'insensitive',
              },
            },
            {
              last_name: {
                contains: 'mcq',
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
          _count: {
            select: {
              film_actor: true,
            },
          },
        },
      });

      expect(actors).toEqual(expected);
    });

    it('should return an error when there is an error fetching actors', async () => {
      mockFindMany.mockRejectedValue(new Error('Test actor service error'));

      await expect(
        fetchAllActors({
          where: {
            OR: [
              {
                first_name: {
                  contains: 'mcq',
                  mode: 'insensitive',
                },
              },
              {
                last_name: {
                  contains: 'mcq',
                  mode: 'insensitive',
                },
              },
            ],
          },
          select: {
            actor_id: true,
            first_name: true,
            last_name: true,
            _count: {
              select: {
                film_actor: true,
              },
            },
          },
        })
      ).rejects.toThrow(new Error('Test actor service error'));
    });

    it('should return an error when there is an error fetching actors, returning stock answer if no error message is given', async () => {
      mockFindMany.mockRejectedValue(new Error());

      await expect(
        fetchAllActors({
          where: {
            OR: [
              {
                first_name: {
                  contains: 'mcq',
                  mode: 'insensitive',
                },
              },
              {
                last_name: {
                  contains: 'mcq',
                  mode: 'insensitive',
                },
              },
            ],
          },
          select: {
            actor_id: true,
            first_name: true,
            last_name: true,
            _count: {
              select: {
                film_actor: true,
              },
            },
          },
        })
      ).rejects.toThrow(
        new Error('Failed to fetch all actors. Please try again later.')
      );
    });
  });

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
      });

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

  describe('add actor', () => {
    it('should add an actor', async () => {
      const actorData = {
        data: { first_name: 'John', last_name: 'Doe' },
      };
      const mockCreatedActor = {
        actor_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        created_at: new Date(),
      };

      mockCreate.mockResolvedValue(mockCreatedActor);

      // Call the function
      const result = await addActor(actorData);

      // Assertions
      expect(mockCreate).toHaveBeenCalledTimes(1); // Ensure create was called
      expect(mockCreate).toHaveBeenCalledWith(actorData); // Ensure correct input
      expect(result).toEqual(mockCreatedActor); // Ensure correct output
    });

    it('should throw an error if the actor already exists', async () => {
      mockCreate.mockRejectedValue(new Error('Actor already exists'));

      await expect(
        addActor({
          data: { first_name: 'John', last_name: 'Doe' },
        })
      ).rejects.toThrow(new Error('Actor already exists'));
    });
  });
});
