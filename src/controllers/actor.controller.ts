import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getActorFindUniqueArgs } from '../services/helpers/actors/getActorFindUniqueArgs';
import { fetchActorById, fetchAllActors } from '../services/actor.service';
import { fetchAllActorsWithFilmCountArgs } from '../services/helpers/actors/fetchAllActorsWithFilmCountArgs';

const prisma = new PrismaClient();

export const getAllActors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const args = fetchAllActorsWithFilmCountArgs(req);
    const actors = await fetchAllActors(args);
    res.status(200).json(actors);
  } catch (error: any) {
    next(error);
  }
};

export const getActorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const actor = await fetchActorById(getActorFindUniqueArgs(req));
    res.status(200).json(actor);
  } catch (error: any) {
    next(error);
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
