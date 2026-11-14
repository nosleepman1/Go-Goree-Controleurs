import { api, endpoints } from "@/api/client";
import { ApiUser, AuthResponse, Controleur, LoginPayload } from "@/types/auth";
import { Wrapped } from "@/types/api";

export function mapUser(apiUser: ApiUser): Controleur {
  return {
    id: apiUser.id,
    nom: `${apiUser.prenom} ${apiUser.nom}`.trim(),
    email: apiUser.email,
    telephone: apiUser.telephone ?? undefined,
    role: apiUser.role?.nom ?? "",
  };
}

export const authApi = {
  /** POST /login — réponse brute, sans enveloppe "data" (LoginResource::$wrap = null). */
  async login(payload: LoginPayload): Promise<{ user: Controleur; token: string }> {
    const { data } = await api.post<AuthResponse>(endpoints.auth.login, {
      email: payload.email,
      mot_de_passe: payload.password,
    });

    return { user: mapUser(data.user), token: data.access_token };
  },

  /** GET /me — wrappé dans { data }. */
  async me(): Promise<Controleur> {
    const { data } = await api.get<Wrapped<ApiUser>>(endpoints.auth.me);
    return mapUser(data.data);
  },

  async logout(): Promise<void> {
    await api.post(endpoints.auth.logout);
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post(endpoints.auth.forgotPassword, { email });
  },
};
