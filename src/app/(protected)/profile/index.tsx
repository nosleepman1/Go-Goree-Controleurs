import { Ionicons } from "@expo/vector-icons";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
      <Text className="text-sm text-gray-500">{libelle}</Text>
      <Text className="text-sm font-semibold text-gray-900">{valeur}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const confirmerDeconnexion = () => {
    Alert.alert("Se déconnecter ?", "Vous devrez saisir à nouveau vos identifiants.", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", style: "destructive", onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="mb-4 text-2xl font-bold text-gray-900">Profil</Text>

        <View className="mb-5 items-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <Ionicons name="person" size={36} color={colors.primary} />
          </View>
          <Text className="mt-3 text-lg font-bold text-gray-900">{user?.nom ?? "—"}</Text>
          {user?.role ? <View className="mt-2"><Badge label={user.role} ton="info" /></View> : null}
        </View>

        <Card>
          <Ligne libelle="Email" valeur={user?.email ?? "—"} />
          <Ligne libelle="Téléphone" valeur={user?.telephone ?? "—"} />
          <Ligne libelle="Identifiant" valeur={user ? user.id.slice(0, 8) : "—"} />
        </Card>

        <View className="mt-8">
          <PillButton label="Se déconnecter" variant="outline" onPress={confirmerDeconnexion} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
