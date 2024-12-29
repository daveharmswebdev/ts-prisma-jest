import { Request } from 'express';
import { getFilmFindUniqueArgs } from '../../../../../src/services/helpers/films/getFilmFindUniqueArgs';

describe('getFilmFindUniqueArgs', () => {
  it('should return a where object when given a film id', () => {
    const req: Partial<Request> = {
      params: {
        id: '1',
      },
    };

    const args = getFilmFindUniqueArgs(req as Request);

    const expected = {
      where: {
        film_id: 1,
      },
    };

    expect(args).toEqual(expected);
  });

  it('should throw an error when id is not a number', () => {
    const req: Partial<Request> = {
      params: {
        id: 'test',
      },
    };

    expect(() => getFilmFindUniqueArgs(req as Request)).toThrow(
      'Invalid film id'
    );
  });
});
