import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { getActorFindManyArgs } from '@/services/helpers/getActorFindManyArgs';

export const fetchAllActorsWithFilmCountArgs = (
  req: Request
): Prisma.actorFindManyArgs => {
  return {
    ...getActorFindManyArgs(req),
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
  } as unknown as Prisma.actorFindManyArgs;
};
