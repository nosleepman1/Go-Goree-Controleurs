import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { boardingApi } from "@/api/boarding.api";
import { queryKeys } from "@/api/client";
import { voyageApi } from "@/api/voyage.api";

/** Sessions d'embarquement actuellement ouvertes (tous contrôleurs confondus). */
export function useEmbarquements() {
  return useQuery({
    queryKey: queryKeys.embarquements,
    queryFn: boardingApi.list,
    // Une session peut être ouverte ou fermée par un collègue pendant qu'on
    // regarde la liste : on la garde fraîche.
    staleTime: 10_000,
  });
}

export function useVoyagesDuJour() {
  return useQuery({
    queryKey: ["voyages", "today"],
    queryFn: voyageApi.duJour,
  });
}

export function useOuvrirEmbarquement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (voyageId: string) => boardingApi.ouvrir(voyageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.embarquements });
    },
  });
}

export function useFermerEmbarquement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (embarquementId: string) => boardingApi.fermer(embarquementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.embarquements });
    },
  });
}
