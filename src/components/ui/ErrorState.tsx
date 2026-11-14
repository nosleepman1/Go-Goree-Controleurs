import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/constants/theme";

/**
 * Erreur de chargement avec possibilité de réessayer. Sur le terrain le réseau
 * tombe régulièrement : chaque écran de données doit offrir une seconde chance
 * sans obliger à quitter puis rouvrir l'app.
 */
export default function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View className="items-center justify-center px-8 py-12">
      <Ionicons name="cloud-offline-outline" size={44} color={colors.textGray} />
      <Text className="mt-3 text-center text-base font-semibold text-gray-800">
        Chargement impossible
      </Text>
      <Text className="mt-1 text-center text-sm text-gray-500">
        {message ?? "Une erreur est survenue."}
      </Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="mt-4 rounded-full border border-blue-600 px-5 py-2.5"
          accessibilityRole="button"
        >
          <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
            Réessayer
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
