import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { gradients } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <LinearGradient colors={gradients.primary} style={{ padding: 20, paddingBottom: 28 }}>
          <Text className="text-sm text-white/80">Bonjour</Text>
          <Text className="mt-0.5 text-2xl font-bold text-white">{user?.nom ?? "Contrôleur"}</Text>
          <Text className="mt-1 text-sm text-white/80">Dakar ↔ Île de Gorée</Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}
