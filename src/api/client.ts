export { api, ApiError, authEvents } from "@/lib/axios";

/** Routes de l'API v1 consommées par l'app contrôleurs. */
export const endpoints = {
  auth: {
    login: "/login",
    logout: "/logout",
    me: "/me",
    forgotPassword: "/password/forgot",
    resetPassword: "/password/reset",
  },
  embarquements: {
    list: "/embarquements",
    ouvrir: "/embarquements/ouvrir",
    fermer: (id: string) => `/embarquements/${id}/fermer`,
  },
  scans: {
    list: "/scans",
    create: "/scans",
    detail: (id: string) => `/scans/${id}`,
  },
} as const;

/** Clés de cache TanStack Query, centralisées pour que l'invalidation soit sûre. */
export const queryKeys = {
  me: ["auth", "me"] as const,
  embarquements: ["embarquements"] as const,
  embarquement: (id: string) => ["embarquements", id] as const,
  scans: ["scans"] as const,
};
