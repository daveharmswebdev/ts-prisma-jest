import { NextFunction, Request, Response } from 'express';
import {
  getAllActors,
  getActorById,
  createActor,
} from '@/controllers/actor.controller';
import {
  fetchAllActors,
  fetchActorById,
  addActor,
} from '@/services/actor.service';
import { fetchAllActorsWithFilmCountArgs } from '@/services/helpers/actors/fetchAllActorsWithFilmCountArgs';
import { getActorFindUniqueArgs } from '@/services/helpers/actors/getActorFindUniqueArgs';
import createError from 'http-errors';

jest.mock('@/services/actor.service');
jest.mock('@/services/helpers/actors/fetchAllActorsWithFilmCountArgs');
jest.mock('@/services/helpers/actors/getActorFindUniqueArgs');

const mockFetchAllActors = fetchAllActors as jest.Mock;
const mockFetchAllActorsWithFilmCountArgs =
  fetchAllActorsWithFilmCountArgs as jest.Mock;
const mockGetActorFindUniqueArgs = getActorFindUniqueArgs as jest.Mock;
const mockFetchActorById = fetchActorById as jest.Mock;
const mockAddActor = addActor as jest.Mock;

describe('ActorController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  jest.spyOn(console, 'error').mockImplementation(() => {});

  describe('get all actors', () => {
    beforeEach(() => {
      req = {
        query: {},
      };

      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return all actors', async () => {
      const mockActors = [
        {
          id: 1,
          name: 'test',
        },
        {
          id: 2,
          name: 'test2',
        },
      ];

      mockFetchAllActorsWithFilmCountArgs.mockReturnValue({
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
          _count: {
            select: {
              film_actor: true, // Counts the number of films associated with the actor
            },
          },
        },
      });
      mockFetchAllActors.mockReturnValue(mockActors);

      await getAllActors(req as Request, res as Response, next);
      expect(mockFetchAllActorsWithFilmCountArgs).toHaveBeenCalledWith(
        req as Request
      );
      expect(mockFetchAllActors).toHaveBeenCalledWith({
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
          _count: {
            select: {
              film_actor: true, // Counts the number of films associated with the actor
            },
          },
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockActors);
    });

    it('should return an error when there is an error fetching actors', async () => {
      mockFetchAllActorsWithFilmCountArgs.mockReturnValue({
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
          _count: {
            select: {
              film_actor: true, // Counts the number of films associated with the actor
            },
          },
        },
      });
      mockFetchAllActors.mockRejectedValue(
        createError(500, 'Test actor controller error')
      );

      await getAllActors(req as Request, res as Response, next);
      expect(mockFetchAllActorsWithFilmCountArgs).toHaveBeenCalledWith(
        req as Request
      );
      expect(mockFetchAllActors).toHaveBeenCalledWith({
        select: {
          actor_id: true,
          first_name: true,
          last_name: true,
          _count: {
            select: {
              film_actor: true, // Counts the number of films associated with the actor
            },
          },
        },
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test actor controller error',
          status: 500,
        })
      );
    });
  });

  describe('get actor by id', () => {
    beforeEach(() => {
      req = {
        params: {
          id: '1',
        },
      };

      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an actor', async () => {
      const mockActor = {
        actor_id: 1,
        first_name: 'PENELOPE',
        last_name: 'GUINESS',
        films: [
          {
            film_id: 1,
            title: 'ACADEMY DINOSAUR',
          },
          {
            film_id: 23,
            title: 'ANACONDA CONFESSIONS',
          },
          {
            film_id: 25,
            title: 'ANGELS LIFE',
          },
        ],
      };

      mockGetActorFindUniqueArgs.mockReturnValue({
        where: {
          actor_id: 1,
        },
      });
      mockFetchActorById.mockReturnValue(mockActor);

      await getActorById(req as Request, res as Response, next);
      expect(mockGetActorFindUniqueArgs).toHaveBeenCalledWith(req as Request);
      expect(mockFetchActorById).toHaveBeenCalledWith({
        where: {
          actor_id: 1,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockActor);
      expect(next).not.toHaveBeenCalled();
    });

    it('should return a 404 if the actor is not found', async () => {
      mockGetActorFindUniqueArgs.mockReturnValue({
        where: {
          actor_id: 1,
        },
      });
      mockFetchActorById.mockRejectedValue(
        createError(404, 'Actor not found.')
      );

      await getActorById(req as Request, res as Response, next);
      expect(mockGetActorFindUniqueArgs).toHaveBeenCalledWith(req as Request);
      expect(mockFetchActorById).toHaveBeenCalledWith({
        where: {
          actor_id: 1,
        },
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Actor not found.',
          status: 404,
        })
      );
    });

    it('should return a 500 if there is an error fetching the actor', async () => {
      mockGetActorFindUniqueArgs.mockReturnValue({
        where: {
          actor_id: 1,
        },
      });
      mockFetchActorById.mockRejectedValue(createError(500, 'Test error.'));

      await getActorById(req as Request, res as Response, next);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error.',
          status: 500,
        })
      );
    });
  });

  describe('create actor', () => {
    beforeEach(() => {
      req = {
        query: {},
      };

      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create an actor', async () => {
      req = {
        body: { first_name: 'John', last_name: 'Doe' },
      };
      const mockCreatedActor = {
        actor_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        last_update: new Date(),
      };
      const mockResponse = {
        success: true,
        data: mockCreatedActor,
        error: null,
      };

      mockAddActor.mockReturnValue(mockCreatedActor);

      await createActor(req as Request, res as Response, next);
      expect(mockAddActor).toHaveBeenCalledWith({
        data: expect.objectContaining({
          first_name: 'John',
          last_name: 'Doe',
        }),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should pass errors to the error handler', async () => {
      mockAddActor.mockRejectedValue(createError(500, 'Test error.'));
      req = {
        body: { first_name: 'John', last_name: 'Doe' },
      };

      await createActor(req as Request, res as Response, next);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test error.',
          status: 500,
        })
      );
    });
  });
});
