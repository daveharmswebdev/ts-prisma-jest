import { Request } from 'express';
import { getActorFindManyArgs } from '../../src/services/helpers/getActorFindManyArgs';

describe('getActorFindManyArgs', () => {
  it('should return an empty object when no search parameter is given', () => {
    const req: Partial<Request> = {
      query: {},
    };

    const args = getActorFindManyArgs(req as Request);

    expect(args).toEqual({});
  });

  it('should a where arg when give a search parameter', () => {
    const req: Partial<Request> = {
      query: {
        search: 'test',
      },
    };

    const args = getActorFindManyArgs(req as Request);

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
    };

    expect(args).toEqual(expected);
  });
});
