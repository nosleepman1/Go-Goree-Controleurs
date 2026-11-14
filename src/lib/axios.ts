import axios, { AxiosError } from "axios";

import { API_BASE_URL } from "@/constants/config";
import { tokenService } from "@/services/token.service";

/**
 * Erreur normalisée : le mapping des réponses Laravel se fait ici, une seule
 * fois, pour que les écrans n'aient jamais à inspecter un status HTTP.
 */
export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  retryAfter?: number;

  constructor(
    message: string,
    opts: { status?: number; errors?: Record<string, string[]>; retryAfter?: number } = {}
  ) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.errors = opts.errors;
    this.retryAfter = opts.retryAfter;
  }
}

/**
 * L'intercepteur n'a pas accès au routeur ni au contexte React. Pour qu'un
 * jeton expiré ou révoqué (401 sur une route authentifiée) déclenche une
 * déconnexion globale, on passe par ce pub-sub : AuthProvider s'y abonne une
 * fois au montage.
 */
type Listener = () => void;
const unauthorizedListeners = new Set<Listener>();

export const authEvents = {
  onUnauthorized(listener: Listener) {
    unauthorizedListeners.add(listener);
    return () => {
      unauthorizedListeners.delete(listener);
    };
  },
  emitUnauthorized() {
    unauthorizedListeners.forEach((listener) => listener());
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Sans effet hors ngrok ; avec un tunnel ngrok gratuit, évite la page
    // d'avertissement interstitielle qui casserait les réponses JSON.
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await tokenService.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface BackendErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<BackendErrorBody>) => {
    // Pas de réponse du tout : backend injoignable. Sur le terrain c'est le cas
    // le plus fréquent (réseau mobile qui tombe entre deux embarquements).
    if (!error.response) {
      return Promise.reject(
        new ApiError(
          "Impossible de joindre le serveur. Vérifiez votre connexion et l'adresse de l'API.",
          {}
        )
      );
    }

    const { status, data, headers } = error.response;
    const backendMessage = data?.message;
    const requestHadToken = Boolean(
      (error.config?.headers as Record<string, unknown> | undefined)?.Authorization
    );

    // throttle:6,1 sur /login et /password/* côté backend.
    if (status === 429) {
      const rawRetryAfter = headers?.["retry-after"];
      const retryAfter = rawRetryAfter ? Number(rawRetryAfter) : undefined;
      return Promise.reject(
        new ApiError(
          retryAfter
            ? `Trop de tentatives. Réessayez dans ${retryAfter}s.`
            : "Trop de tentatives. Réessayez dans un instant.",
          { status, retryAfter }
        )
      );
    }

    if (status === 401) {
      // 401 avec jeton = session expirée ou révoquée -> déconnexion globale.
      // 401 sans jeton = simple échec de /login : on laisse l'écran afficher
      // l'erreur sans toucher à l'état d'authentification.
      if (requestHadToken) {
        await tokenService.clear();
        authEvents.emitUnauthorized();
      }
      return Promise.reject(
        new ApiError(
          backendMessage ??
            (requestHadToken
              ? "Session expirée, veuillez vous reconnecter."
              : "Identifiants invalides."),
          { status }
        )
      );
    }

    if (status === 403) {
      return Promise.reject(
        new ApiError(backendMessage ?? "Vous n'avez pas les droits pour cette action.", { status })
      );
    }

    if (status === 422) {
      return Promise.reject(
        new ApiError(backendMessage ?? "Certaines informations sont invalides.", {
          status,
          errors: data?.errors,
        })
      );
    }

    return Promise.reject(new ApiError(backendMessage ?? "Une erreur est survenue.", { status }));
  }
);
