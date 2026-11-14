import { api, endpoints } from "@/api/client";
import { Paginated } from "@/types/api";
import { ApiEmbarquement, Embarquement } from "@/types/boarding";

function mapEmbarquement(item: ApiEmbarquement): Embarquement {
  const voyage = item.voyage ?? null;
  const heure = voyage?.trajet?.heure_depart;

  return {
    id: item.id,
    statut: item.statut,
    ouvertA: item.ouvert_a,
    voyageId: item.voyage_id,
    // Les relations trajet/chaloupe ne sont pas garanties : on affiche un vide
    // explicite plutôt qu'un nom de chaloupe inventé.
    chaloupe: voyage?.chaloupe?.nom ?? "—",
    heureDepart: heure ? String(heure).slice(0, 5) : "",
    dateVoyage: voyage?.date_voyage ?? null,
    places: voyage?.places ?? null,
    placesRestantes: voyage?.places_restantes ?? null,
  };
}

export const boardingApi = {
  /** GET /embarquements — sessions ouvertes, paginate() brut. */
  async list(): Promise<Embarquement[]> {
    const { data } = await api.get<Paginated<ApiEmbarquement>>(endpoints.embarquements.list);
    return (data.data ?? []).map(mapEmbarquement);
  },

  /**
   * POST /embarquements/ouvrir — idempotent côté backend : si une session est
   * déjà ouverte pour ce voyage, elle est renvoyée telle quelle et plusieurs
   * contrôleurs travaillent alors sur la même.
   */
  async ouvrir(voyageId: string): Promise<Embarquement> {
    const { data } = await api.post<ApiEmbarquement>(endpoints.embarquements.ouvrir, {
      voyage_id: voyageId,
    });
    return mapEmbarquement(data);
  },

  async fermer(embarquementId: string): Promise<Embarquement> {
    const { data } = await api.post<ApiEmbarquement>(endpoints.embarquements.fermer(embarquementId));
    return mapEmbarquement(data);
  },
};
