/** Trajet tel que renvoyé par le backend (modèle brut). */
export interface ApiTrajet {
  id: string;
  jour: string;
  heure_depart: string;
  duree: string | number;
}

export interface ApiChaloupe {
  id: string;
  nom: string;
  capacite: number;
}

export interface ApiVoyage {
  id: string;
  date_voyage: string;
  places: number;
  places_restantes: number;
  trajet?: ApiTrajet | null;
  chaloupe?: ApiChaloupe | null;
}

/** Session d'embarquement (modèle brut, avec `voyage` chargé). */
export interface ApiEmbarquement {
  id: string;
  statut: "OUVERT" | "FERME";
  ouvert_a: string | null;
  ferme_a: string | null;
  voyage_id: string;
  ouvert_par: string | null;
  voyage?: ApiVoyage | null;
}

/** Forme utilisée par les écrans. */
export interface Embarquement {
  id: string;
  statut: "OUVERT" | "FERME";
  ouvertA: string | null;
  voyageId: string;
  /** Nom de la chaloupe, "—" si la relation n'est pas chargée. */
  chaloupe: string;
  /** "HH:MM" du départ, vide si inconnu. */
  heureDepart: string;
  dateVoyage: string | null;
  places: number | null;
  placesRestantes: number | null;
}
