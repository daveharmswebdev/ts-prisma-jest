import { Router } from 'express';
import {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
} from '../controllers/actor.controller';

const router = Router();

router.get('/', getAllActors); // GET /actors
router.get('/:id', getActorById); // GET /actors/:id
router.post('/', createActor); // POST /actors
router.put('/:id', updateActor); // PUT /actors/:id
router.delete('/:id', deleteActor); // DELETE /actors/:id

export default router;
