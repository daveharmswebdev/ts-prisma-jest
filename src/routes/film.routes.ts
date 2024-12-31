import { Router } from 'express';
import { getAllFilms, getFilmById } from '@/controllers/film.controller';

const router = Router();

router.get('/', getAllFilms);
router.get('/:id', getFilmById);

export default router;
