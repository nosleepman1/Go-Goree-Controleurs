import React, { createContext, useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/api/auth.api";
import { queryKeys } from "@/api/client";
import { ApiError, authEvents } from "@/lib/axios";
import { tokenService } from "@/services/token.service";
import { ROLES_AUTORISES } from "@/constants/config";
import { Controleur, LoginPayload } from "@/types/auth";

interface AuthContextValue {
  user: Controleur | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function estAutorise(role: string) {
  return (ROLES_AUTORISES as readonly string[]).includes(role);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  // null = pas encore vérifié (lecture asynchrone du stockage sécurisé au boot).
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const token = await tokenService.get();
      setHasToken(Boolean(token));
    })();
  }, []);

  // Émis par l'intercepteur sur un 401 avec jeton : session expirée côté serveur.
  useEffect(() => {
    return authEvents.onUnauthorized(() => {
      queryClient.setQueryData(queryKeys.me, null);
      setHasToken(false);
    });
  }, [queryClient]);

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: authApi.me,
    enabled: hasToken === true,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.isError) {
      // Jeton présent mais /me échoue (backend redémarré, jeton révoqué) :
      // ne pas rester bloqué sur un écran de chargement infini.
      setHasToken(false);
    }
  }, [meQuery.isError]);

  const loginMutation = useMutation({
    // Le contrôle de rôle est fait ici, et non dans onSuccess : le rejet doit
    // remonter de façon garantie à l'écran de connexion. Un compte Client se
    // verrait refuser tous les écrans en 403 par le backend — autant l'arrêter
    // tout de suite, avec un message clair et sans conserver le jeton.
    mutationFn: async (payload: LoginPayload) => {
      const { user, token } = await authApi.login(payload);

      if (!estAutorise(user.role)) {
        throw new ApiError(
          "Ce compte n'est pas un compte contrôleur. Utilisez l'application Go Gorée passagers.",
          { status: 403 }
        );
      }

      return { user, token };
    },
    onSuccess: async ({ user, token }) => {
      await tokenService.set(token);
      queryClient.setQueryData(queryKeys.me, user);
      setHasToken(true);
    },
  });

  const logout = useCallback(async () => {
    try {
      if (hasToken) {
        await authApi.logout();
      }
    } catch {
      // Le jeton est peut-être déjà invalide côté serveur : on nettoie localement.
    } finally {
      await tokenService.clear();
      queryClient.clear();
      queryClient.setQueryData(queryKeys.me, null);
      setHasToken(false);
    }
  }, [hasToken, queryClient]);

  const value: AuthContextValue = {
    user: meQuery.data ?? null,
    isLoading: hasToken === null || (hasToken === true && meQuery.isPending),
    login: async (payload) => {
      await loginMutation.mutateAsync(payload);
    },
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
