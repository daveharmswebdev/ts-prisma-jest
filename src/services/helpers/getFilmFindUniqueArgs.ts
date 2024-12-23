import { Request } from 'express';
import { Prisma } from '@prisma/client';

export const getFilmFindUniqueArgs = (
  req: Request
): Prisma.filmFindUniqueArgs => {
  const { id } = req.params;

  if (Number.isNaN(parseInt(id, 10))) {
    throw new Error('Invalid film id');
  }

  return {
    where: {
      film_id: +id,
    },
  };
};
