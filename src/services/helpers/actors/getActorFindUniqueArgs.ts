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
