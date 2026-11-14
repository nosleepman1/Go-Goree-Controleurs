/**
 * Adresse de l'API backend (Laravel). Doit inclure le préfixe /api/v1 :
 * toutes les routes consommées par l'app sont dessous.
 *
 * Se règle via EXPO_PUBLIC_API_URL dans .env.local (voir .env.example).
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const APP_NAME = "Go Gorée Contrôleurs";

/** Clé de stockage sécurisé du jeton Sanctum. */
export const AUTH_TOKEN_KEY = "auth_token";

/**
 * Rôles autorisés à utiliser l'app. Le backend réserve déjà /embarquements et
 * /scans à Agent+Admin ; ce contrôle côté client sert à refuser la connexion
 * d'un compte Client avec un message clair, plutôt qu'à le laisser entrer sur
 * une app dont tous les écrans renverraient 403.
 */
export const ROLES_AUTORISES = ["Agent", "Admin"] as const;
