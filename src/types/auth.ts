/** Forme renvoyée par le backend (UserResource) : champs en français. */
export interface ApiUser {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  active?: boolean;
  role?: { id: string; nom: string } | null;
}

/** Forme utilisée dans l'app. */
export interface Controleur {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
}
