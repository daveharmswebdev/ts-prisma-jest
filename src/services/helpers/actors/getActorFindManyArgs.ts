import { Request } from 'express';
import { Prisma } from '@prisma/client';

export const getActorFindManyArgs = (
  req: Request
): Prisma.actorFindManyArgs => {
  const { search } = req.query;

  return {
    ...(search && {
      where: {
        OR: [
          {
            first_name: {
              contains: search, // Partial match for first_name
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            last_name: {
              contains: search, // Partial match for last_name
              mode: 'insensitive', // Case-insensitive search
            },
          },
        ],
      },
    }),
  } as Prisma.actorFindManyArgs;
};
