import prisma from '../../../src/libs/prisma';
import { fetchActorById } from '../../../src/services/actor.service';

jest.mock('../../../src/libs/prisma', () => ({
  actor: {
    findUnique: jest.fn(),
  },
}));

const mockFindUnique = prisma.actor.findUnique as jest.Mock;

describe('ActorService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAllActors', () => {
    it('should return all actors', async () => {
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

      const actors = await fetchActorById({
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
      expect(actors).toEqual(expected);
    });
  });
});
