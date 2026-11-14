import { api } from "@/api/client";
import { Paginated } from "@/types/api";
import { ApiVoyage } from "@/types/boarding";

export interface VoyageDuJour {
  id: string;
  heureDepart: string;
  chaloupe: string;
  places: number;
  placesRestantes: number;
}

/**
 * Voyages du jour — sert à choisir le voyage dont on ouvre l'embarquement.
 *
 * Volontairement limité à la journée : un client peut réserver jusqu'à une
 * semaine à l'avance, mais un contrôleur n'embarque que les départs du jour.
 *
 * `periode=today` reste exhaustif côté backend (départs déjà effectués
 * compris), contrairement aux listings d'achat qui les écartent.
 */
export const voyageApi = {
  async duJour(): Promise<VoyageDuJour[]> {
    const { data } = await api.get<Paginated<ApiVoyage>>("/voyages", {
      params: { periode: "today" },
    });

    return (data.data ?? []).map((voyage) => ({
      id: voyage.id,
      heureDepart: voyage.trajet?.heure_depart
        ? String(voyage.trajet.heure_depart).slice(0, 5)
        : "",
      chaloupe: voyage.chaloupe?.nom ?? "—",
      places: voyage.places ?? 0,
      placesRestantes: voyage.places_restantes ?? 0,
    }));
  },
};
