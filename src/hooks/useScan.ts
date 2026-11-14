import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/client";
import { ticketApi } from "@/api/ticket.api";

export function useScanner(embarquementId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (qrToken: string) => ticketApi.scanner(qrToken, embarquementId),
    onSuccess: () => {
      // Un scan valide fait passer le billet à UTILISE et change le nombre de
      // passagers embarqués : les deux listes deviennent obsolètes.
      queryClient.invalidateQueries({ queryKey: queryKeys.scans });
      queryClient.invalidateQueries({ queryKey: queryKeys.embarquements });
    },
  });
}

export function useHistoriqueScans() {
  return useQuery({
    queryKey: queryKeys.scans,
    queryFn: ticketApi.historique,
  });
}
