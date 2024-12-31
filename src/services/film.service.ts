import prisma from '@/libs/prisma';
import { Prisma } from '@prisma/client';

export const fetchAllFilms = async (args: Prisma.filmFindManyArgs) =>
  prisma.film.findMany(args);

export const fetchFilmById = async (args: Prisma.filmFindUniqueArgs) =>
  prisma.film.findUnique(args);
