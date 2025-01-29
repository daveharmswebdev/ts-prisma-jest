# Testing
## Unit and Integration

What is unit testing?  You are testing a unit in isolation.  You have a function.  It has a purpose, and it has logic.
You want to verify that it completes its purpose and that it's logic is sound.

```typescript
import { Request } from 'express';
import { Prisma } from '@prisma/client';

export const getActorFindUniqueArgs = (
  req: Request
): Prisma.actorFindUniqueArgs => {
  const { id } = req.params;

  if (Number.isNaN(parseInt(id, 10))) {
    throw new Error('Invalid actor id');
  }

  return {
    where: {
      actor_id: +id,
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
  } as Prisma.actorFindUniqueArgs;
};
```

We have a very simple function.  It takes an Express Request object and then returns Prisma.actorFindUniqueArgs.
And if for some reason the user of the api makes a request where the id is not a number then it throws an error.
So in our testing we want to know that the function does produce such and object and we want verify the error will be thrown if the id is not a number.

```typescript
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
```

What makes this a good example, maybe too good of an example, is that it is simple pure function.  Other than the interfaces there are no externalities.
There is no external logic.

Even this function...

```typescript
import { Request } from 'express';
import { Prisma } from '@prisma/client';

export const getFilmFindManyArgs = (req: Request): Prisma.filmFindManyArgs => {
  const { title, description, year, year_end, year_verb, rating } = req.query;

  return {
    ...(title && { title: { contains: title, mode: 'insensitive' } }),
    ...(description && {
      description: { contains: description, mode: 'insensitive' },
    }),
    ...(rating && { rating: { equals: rating } }),
    ...handleYear(year as string, year_end as string, year_verb as string),
  } as Prisma.filmFindManyArgs;
};

const handleYear = (year: string, year_end: string, year_verb: string) => {
  if (year_verb === 'equals') {
    return {
      release_year: { equals: +year },
    };
  }
  if (year_verb === 'after') {
    return {
      release_year: { gte: +year },
    };
  }
  if (year_verb === 'before') {
    return {
      release_year: { lte: +year },
    };
  }
  if (year_verb === 'between' && year_end) {
    return {
      release_year: { in: [+year, +year_end] },
    };
  }

  return {};
};
```

...though slightly more sophisticated and possessing more logic then the prior test is still simple to test.

```typescript
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
```

There might be more paths to test, and therefore more 'it' blocks.  But the logic is all contained within the function.  There is no imported logic.

Furthermore it is deterministic and idempotent, meaning that no matter what the same inputs yields the same output.

As programmers we should prefer this kind of simplistic code.  It's not always this simple, but while it is we should take advantage of leveraging unit testing to ensure quality and reliability.  

We want code that adheres the Single Responsibility Principle.

The Single Responsibility Principle (SRP) states that a class, module, or function should have one and only one reason to change, meaning it should only perform a single, well-defined responsibility.

![One Job](./assets/loki-you-had-one-job.gif)

The above functions have one-ish job take a request object and produce a prisma args object.  If it can't do that 'one' job it should explain why - the error message.
