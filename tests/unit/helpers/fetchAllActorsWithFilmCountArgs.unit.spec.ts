import { Request } from 'express';
import { fetchAllActorsWithFilmCountArgs } from '../../../src/services/helpers/actors/fetchAllActorsWithFilmCountArgs';

describe('fetchAllActorsWithFilmCountArgs', () => {
  it('should return args for fetchAllActorsWithFilmCount', () => {
    const req: Partial<Request> = {
      query: {
        search: 'test',
      },
    };

    const args = fetchAllActorsWithFilmCountArgs(req as Request);

    const expected = {
      where: {
        OR: [
          {
            first_name: {
              contains: 'test', // Partial match for first_name
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            last_name: {
              contains: 'test', // Partial match for last_name
              mode: 'insensitive', // Case-insensitive search
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
            film_actor: true, // Counts the number of films associated with the actor
          },
        },
      },
    };

    expect(args).toEqual(expected);
  });

  it('should return just select when there is no query', () => {
    const req: Partial<Request> = {
      query: {},
    };

    const args = fetchAllActorsWithFilmCountArgs(req as Request);

    const expected = {
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
    };

    expect(args).toEqual(expected);
  });
});
