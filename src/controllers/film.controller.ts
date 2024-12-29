import { Request, Response } from 'express';
import { getFilmFindManyArgs } from '../services/helpers/films/getFilmFindManyArgs';
import { fetchAllFilms, fetchFilmById } from '../services/film.service';
import { getFilmFindUniqueArgs } from '../services/helpers/films/getFilmFindUniqueArgs';

export const getAllFilms = async (req: Request, res: Response) => {
  try {
    const args = getFilmFindManyArgs(req);
    const films = await fetchAllFilms(args);
    res.status(200).json(films);
  } catch (error: any) {
    console.error('Error fetching films', error);
    res.status(500).json({ error: error.message || 'Failed to fetch films' });
  }
};

export const getFilmById = async (req: Request, res: Response) => {
  try {
    const args = getFilmFindUniqueArgs(req);
    const film = await fetchFilmById(args);
    res.status(200).json(film);
  } catch (error: any) {
    console.error('Error fetching films', error);
    res.status(500).json({ error: error.message || 'Failed to fetch films' });
  }
};
