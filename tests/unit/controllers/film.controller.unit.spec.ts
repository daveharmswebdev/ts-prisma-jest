import { Request, Response } from 'express';
import { getAllFilms } from '../../../src/controllers/film.controller';
import { getFilmFindManyArgs } from '../../../src/services/helpers/getFilmFindManyArgs';
import { fetchAllFilms } from '../../../src/services/film.service';

jest.mock('../../../src/services/film.service');
jest.mock('../../../src/services/helpers/getFilmFindManyArgs');

const mockGetFilmFindManyArgs = getFilmFindManyArgs as jest.Mock;
const mockFetchAllFilms = fetchAllFilms as jest.Mock;

describe('actor controller', () => {
  describe('get all films', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    beforeEach(() => {
      req = {
        query: {},
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

    it('should return all films', async () => {
      const mockFilms = [
        {
          id: 1,
          title: 'test',
        },
        {
          id: 2,
          title: 'test2',
        },
      ];

      mockGetFilmFindManyArgs.mockReturnValue({});
      mockFetchAllFilms.mockReturnValue(mockFilms);

      await getAllFilms(req as Request, res as Response);
      expect(mockGetFilmFindManyArgs).toHaveBeenCalledWith(req as Request);
      expect(mockFetchAllFilms).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFilms);
    });

    it('should return an error when there is an error fetching films', async () => {
      mockGetFilmFindManyArgs.mockReturnValue({});
      mockFetchAllFilms.mockRejectedValue(new Error('test error'));

      await getAllFilms(req as Request, res as Response);
      expect(mockGetFilmFindManyArgs).toHaveBeenCalledWith(req as Request);
      expect(mockFetchAllFilms).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'test error',
      });
    });
  });
});
