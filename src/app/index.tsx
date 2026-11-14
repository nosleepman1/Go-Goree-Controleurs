import { Redirect } from "expo-router";

import Loading from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";

export default function IndexRedirection() {
  const { user, isLoading } = useAuth();

  // Tant que le jeton stocké n'a pas été relu et validé par /me, on n'oriente
  // pas : rediriger trop tôt renverrait un contrôleur déjà connecté vers le
  // formulaire de login à chaque ouverture de l'app.
  if (isLoading) {
    return <Loading message="Connexion en cours…" />;
  }

  return user ? <Redirect href="/(protected)/home" /> : <Redirect href="/(auth)/login" />;
}
