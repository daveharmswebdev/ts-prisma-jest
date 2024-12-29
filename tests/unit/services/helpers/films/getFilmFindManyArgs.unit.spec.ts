import { Request } from 'express';
import { getFilmFindManyArgs } from '../../../../../src/services/helpers/films/getFilmFindManyArgs';

describe('Produce where object', () => {
  it('should produce where object when title is part of the query', () => {
    const req: Partial<Request> = {
      query: {
        title: 'test',
      },
    };

    const where = getFilmFindManyArgs(req as Request);

    const expected = {
      title: {
        contains: 'test',
        mode: 'insensitive',
      },
    };

    expect(where).toStrictEqual(expected);
  });

  it('should produce where object when title and description are part of the query', () => {
    const req: Partial<Request> = {
      query: {
        title: 'test',
        description: 'test_description',
      },
    };

    const where = getFilmFindManyArgs(req as Request);

    const expected = {
      title: {
        contains: 'test',
        mode: 'insensitive',
      },
      description: {
        contains: 'test_description',
        mode: 'insensitive',
      },
    };

    expect(where).toStrictEqual(expected);
  });

  it('should be able to generate a search object that searches resource for a specific year', () => {
    const req: Partial<Request> = {
      query: {
        year: '1990',
        year_verb: 'equals',
      },
    };

    const where = getFilmFindManyArgs(req as Request);

    const expected = {
      release_year: {
        equals: 1990,
      },
    };

    expect(where).toStrictEqual(expected);
  });

  it('should be able to generate a search object that searches after a specific year', () => {
    const req: Partial<Request> = {
      query: {
        year: '1990',
        year_verb: 'after',
      },
    };

    const where = getFilmFindManyArgs(req as Request);

    const expected = {
      release_year: {
        gte: 1990,
      },
    };

    expect(where).toStrictEqual(expected);
  });

  it('should be able to generate a search object that searches before a specific year', () => {
    const req: Partial<Request> = {
      query: {
        year: '1990',
        year_verb: 'before',
      },
    };

    const where = getFilmFindManyArgs(req as Request);

    const expected = {
      release_year: {
        lte: 1990,
      },
    };

    expect(where).toStrictEqual(expected);
  });

  it('should be able to generate a search object that searches between years', () => {
    const req: Partial<Request> = {
      query: {
        year: '1990',
        year_end: '2010',
        year_verb: 'between',
      },
    };
    const where = getFilmFindManyArgs(req as Request);

    const expected = {
      release_year: {
        in: [1990, 2010],
      },
    };

    expect(where).toStrictEqual(expected);
  });

  it('should be able to generate a search object that searches for a specific rating', () => {
    const req: Partial<Request> = {
      query: {
        rating: 'G',
      },
    };
    const where = getFilmFindManyArgs(req as Request);

    const expected = {
      rating: {
        equals: 'G',
      },
    };
    expect(where).toEqual(expected);
  });

  it('should return an empty object when no search parameter is given', () => {
    const req: Partial<Request> = {
      query: {},
    };

    const where = getFilmFindManyArgs(req as Request);
    expect(where).toEqual({});
  });
});
