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
  } as Prisma.actorFindUniqueArgs;
};
