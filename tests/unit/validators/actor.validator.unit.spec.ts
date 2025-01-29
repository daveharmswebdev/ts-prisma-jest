import { createActorSchema } from '../../../src/validators/actor.validator';
import { ZodError } from 'zod';

describe('ActorValidator - createActorSchema', () => {
  it('should validate an actor', () => {
    const validInput = {
      first_name: 'John',
      last_name: 'Doe',
    };
    const result = createActorSchema.parse(validInput);
    expect(result).toEqual(validInput);
  });

  it('should throw an error if first_name is missing', () => {
    const invalidInput = {
      last_name: 'Doe',
    };

    try {
      createActorSchema.parse(invalidInput);
      fail('Should throw an error');
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);

      const zodError = error as ZodError;
      expect(zodError.issues).toEqual([
        {
          code: 'invalid_type', // Zod error code
          expected: 'string', // Expected field type
          received: 'undefined', // What Zod received instead
          path: ['first_name'], // The path where the error occurred
          message: 'Required', // Default message from Zod
        },
      ]);
    }
  });
});
