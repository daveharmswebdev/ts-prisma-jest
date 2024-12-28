export interface IActorResponse {
  actor_id: number;
  first_name: string;
  last_name: string;
  film_actor: FilmActor[];
}

export interface FilmActor {
  film: Film;
}

export interface Film {
  film_id: number;
  title: string;
}

export interface IActorAndFilms {
  actor_id: number;
  first_name: string;
  last_name: string;
  films: { film_id: number; title: string }[];
}

export const mapFetchActorAndFilms = (
  actor: IActorResponse
): IActorAndFilms => {
  return {
    actor_id: actor.actor_id,
    first_name: actor.first_name,
    last_name: actor.last_name,
    films: actor.film_actor.map(film => film.film),
  };
};
