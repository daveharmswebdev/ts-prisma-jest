import { Request } from 'express';
import { getActorFindUniqueArgs } from '../../src/services/helpers/getActorFindUniqueArgs';

describe('getActorFindUniqueArgs', () => {
  it('should return the correct args when taking in a id route param', () => {
    const req: Partial<Request> = {
      params: {
        id: '1',
      },
    };

    const args = getActorFindUniqueArgs(req as Request);

    const expected = {
      where: {
        actor_id: 1,
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

    expect(() => getActorFindUniqueArgs(req as Request)).toThrow(
      'Invalid actor id'
    );
  });
});
