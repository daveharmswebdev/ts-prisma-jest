import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { fetchActorsWithFilmCount } from '../services/actor.service';
import { getActorFindManyArgs } from '../services/helpers/getActorFindManyArgs';
import { getActorFindUniqueArgs } from '../services/helpers/getActorFindUniqueArgs';

const prisma = new PrismaClient();

export const getAllActors = async (req: Request, res: Response) => {
  try {
    const args = getActorFindManyArgs(req);
    const actors = await prisma.actor.findMany(args);
    res.json(actors);
  } catch (error) {
    console.error('Error fetching actors:', error);
    res.status(500).json({ error: 'Failed to fetch actors' });
  }
};

export const getActorsWithFilms = async (req: Request, res: Response) => {
  try {
    const actors = await fetchActorsWithFilmCount();
    const response = actors.map(actor => ({
      actor_id: actor.actor_id,
      first_name: actor.first_name,
      last_name: actor.last_name,
      total_films: actor._count.film_actor,
    }));
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch actors with films' });
  }
};

export const getActorById = async (req: Request, res: Response) => {
  try {
    const actor = await prisma.actor.findUnique(getActorFindUniqueArgs(req));
    if (actor) {
      res.json(actor);
    } else {
      res.status(404).json({ error: 'Actor not found' });
    }
  } catch (error: any) {
    console.error('Error fetching actor:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch actor' });
  }
};

export const createActor = async (req: Request, res: Response) => {
  const { first_name, last_name } = req.body;
  try {
    const newActor = await prisma.actor.create({
      data: { first_name, last_name, last_update: new Date() },
    });
    res.status(201).json(newActor);
  } catch (error) {
    console.error('Error creating actor:', error);
    res.status(500).json({ error: 'Failed to create actor' });
  }
};

export const updateActor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { first_name, last_name } = req.body;
  try {
    const updatedActor = await prisma.actor.update({
      where: { actor_id: Number(id) },
      data: { first_name, last_name, last_update: new Date() },
    });
    res.json(updatedActor);
  } catch (error) {
    console.error('Error updating actor:', error);
    res.status(500).json({ error: 'Failed to update actor' });
  }
};

export const deleteActor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.actor.delete({
      where: { actor_id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting actor:', error);
    res.status(500).json({ error: 'Failed to delete actor' });
  }
};
