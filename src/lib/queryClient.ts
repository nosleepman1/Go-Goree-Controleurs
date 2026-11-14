import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Une 4xx (401/403/404/422...) est une erreur métier ou d'auth : la
      // retenter ne changera rien. Seules les erreurs réseau et les 5xx
      // méritent quelques essais — ce qui compte sur un réseau mobile.
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status !== undefined && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
});
