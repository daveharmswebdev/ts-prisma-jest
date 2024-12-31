import { Router } from 'express';
import {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
} from '@/controllers/actor.controller';
import { validateRequest } from '@/middleWares/validate-request';
import { createActorSchema } from '@/validators/actor.validator';

const router = Router();

router.get('/', getAllActors); // GET /actors
router.get('/:id', getActorById); // GET /actors/:id
router.post('/', validateRequest(createActorSchema), createActor); // POST /actors
router.put('/:id', updateActor); // PUT /actors/:id
router.delete('/:id', deleteActor); // DELETE /actors/:id

export default router;
