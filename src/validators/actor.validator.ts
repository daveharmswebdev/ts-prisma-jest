import { z } from 'zod';

export const createActorSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
});

export type CreateActorInput = z.infer<typeof createActorSchema>;
