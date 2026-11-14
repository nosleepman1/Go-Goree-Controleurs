/**
 * Enveloppes de réponse Laravel.
 *
 * Le backend n'a pas de convention unique (vérifié endpoint par endpoint) :
 *  - /login                       -> objet brut (LoginResource::$wrap = null)
 *  - /me                          -> wrappé dans { data: ... }
 *  - /embarquements, /scans       -> paginate() brut : { data: [...], meta, links }
 *  - /embarquements/ouvrir|fermer -> modèle brut, sans enveloppe
 *
 * On ne devine pas : chaque fonction d'API déballe explicitement ce que son
 * endpoint renvoie réellement.
 */
export interface Paginated<T> {
  data: T[];
  links?: unknown;
  meta?: unknown;
}

export interface Wrapped<T> {
  data: T;
}
