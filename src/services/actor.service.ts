import prisma from '../libs/prisma';
import { Prisma } from '@prisma/client';

export const fetchAllActors = async (args: Prisma.actorFindManyArgs) =>
  prisma.actor.findMany(args);

export const fetchActorById = async (args: Prisma.actorFindUniqueArgs) =>
  prisma.actor.findUnique(args);
