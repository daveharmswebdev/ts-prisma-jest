import {
  IActorAndFilms,
  IActorResponse,
  mapFetchActorAndFilms,
} from '../../../../src/controllers/helpers/mappers';

describe('mapFetchActorAndFilms', () => {
  it('should map actor response to actor and films object correctly', () => {
    const actorResponse: IActorResponse = {
      actor_id: 1,
      first_name: 'John',
      last_name: 'Doe',
      film_actor: [
        { film: { film_id: 10, title: 'Film A' } },
        { film: { film_id: 20, title: 'Film B' } },
      ],
    };

    const expected: IActorAndFilms = {
      actor_id: 1,
      first_name: 'John',
      last_name: 'Doe',
      films: [
        { film_id: 10, title: 'Film A' },
        { film_id: 20, title: 'Film B' },
      ],
    };

    const result = mapFetchActorAndFilms(actorResponse);

    expect(result).toEqual(expected);
  });

  it('should handle an actor with no films', () => {
    const actorResponse: IActorResponse = {
      actor_id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      film_actor: [],
    };

    const expected: IActorAndFilms = {
      actor_id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      films: [],
    };

    const result = mapFetchActorAndFilms(actorResponse);

    expect(result).toEqual(expected);
  });

  it('should handle an empty response gracefully', () => {
    const actorResponse: IActorResponse = {
      actor_id: 0,
      first_name: '',
      last_name: '',
      film_actor: [],
    };

    const expected: IActorAndFilms = {
      actor_id: 0,
      first_name: '',
      last_name: '',
      films: [],
    };

    const result = mapFetchActorAndFilms(actorResponse);

    expect(result).toEqual(expected);
  });
});
