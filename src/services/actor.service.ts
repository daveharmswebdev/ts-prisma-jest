import prisma from '@/libs/prisma';
import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import {
  IActorResponse,
  mapFetchActorAndFilms,
} from './helpers/actors/actor.mappers';

export interface IFetchActorResponse {
  actor_id: number;
  first_name: string;
  last_name: string;
  _count: {
    film_actor: number;
  };
}

export interface IFetchAllActorsDto {
  actor_id: number;
  first_name: string;
  last_name: string;
  totalFilms: number;
}

export const fetchAllActors = async (args: Prisma.actorFindManyArgs) => {
  try {
    const response = (await prisma.actor.findMany(
      args
    )) as unknown as IFetchActorResponse[];
    return response.map(({ _count, ...actor }) => ({
      ...actor,
      totalFilms: _count.film_actor,
    }));
  } catch (error: any) {
    console.error('Error while fetching all actors:', error);

    // Throw a custom error or rethrow the original one
    throw createError(
      500,
      error.message || 'Failed to fetch all actors. Please try again later.'
    );
  }
};

export const fetchActorById = async (args: Prisma.actorFindUniqueArgs) => {
  try {
    const response = (await prisma.actor.findUnique(
      args
    )) as unknown as IActorResponse;

    if (!response) {
      console.warn('Actor not found with ID:', args.where.actor_id);

      throw createError(404, 'Actor not found.');
    }

    return mapFetchActorAndFilms(response);
  } catch (error) {
    if (error instanceof createError.HttpError && error.status === 404) {
      throw error;
    }

    console.error('Error while fetching actor by ID:', error);
    throw createError(500, 'Failed to fetch actor. Please try again later.');
  }
};

export const addActor = async (data: Prisma.actorCreateArgs) => {
  try {
    return await prisma.actor.create(data);
  } catch (error: any) {
    console.error('Error while creating actor:', error);
    throw createError(
      500,
      error.message || 'Failed to create actor. Please try again later.'
    );
  }
};
