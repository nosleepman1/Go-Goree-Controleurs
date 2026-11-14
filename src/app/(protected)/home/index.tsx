import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, gradients } from "@/constants/theme";
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

        <View className="-mt-5 px-5">
          <Pressable
            onPress={() => router.push("/(protected)/boardings")}
            accessibilityRole="button"
            className="flex-row items-center rounded-2xl bg-white p-4 shadow-sm"
            style={{ borderWidth: 1, borderColor: colors.border }}
          >
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Ionicons name="qr-code-outline" size={24} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">Scanner des billets</Text>
              <Text className="mt-0.5 text-sm text-gray-500">
                Choisissez une session d'embarquement
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textGray} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
