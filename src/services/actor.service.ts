import prisma from '../libs/prisma';
import { Prisma } from '@prisma/client';
import {
  IActorResponse,
  mapFetchActorAndFilms,
} from '../controllers/helpers/mappers';

export const fetchAllActors = async (args: Prisma.actorFindManyArgs) =>
  await prisma.actor.findMany(args);

export const fetchActorById = async (args: Prisma.actorFindUniqueArgs) => {
  const response = (await prisma.actor.findUnique(
    args
  )) as unknown as IActorResponse;
  return mapFetchActorAndFilms(response);
};
