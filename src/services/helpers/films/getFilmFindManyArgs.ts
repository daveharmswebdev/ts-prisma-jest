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
