import { Ionicons } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { API_BASE_URL, APP_NAME } from "@/constants/config";
import { colors } from "@/constants/theme";

function Ligne({
  libelle,
  valeur,
  onPress,
}: {
  libelle: string;
  valeur: string;
  onPress?: () => void;
}) {
  const contenu = (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
      <Text className="text-sm text-gray-500">{libelle}</Text>
      <View className="flex-row items-center">
        <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
          {valeur}
        </Text>
        {onPress ? (
          <Ionicons name="chevron-forward" size={16} color={colors.textGray} className="ml-1" />
        ) : null}
      </View>
    </View>
  );

  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button">
      {contenu}
    </Pressable>
  ) : (
    contenu
  );
}

export default function SettingsScreen() {
  const [permission] = useCameraPermissions();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="mb-4 text-2xl font-bold text-gray-900">Réglages</Text>

        <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Autorisations
        </Text>
        <Card>
          <View className="flex-row items-center justify-between py-1">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900">Caméra</Text>
              <Text className="mt-0.5 text-xs text-gray-500">
                Indispensable pour scanner les billets
              </Text>
            </View>
            {permission?.granted ? (
              <Badge label="Autorisée" ton="succes" />
            ) : (
              <Pressable onPress={() => Linking.openSettings()} accessibilityRole="button">
                <Badge label="Refusée — activer" ton="danger" />
              </Pressable>
            )}
          </View>
        </Card>

        <Text className="mb-2 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Application
        </Text>
        <Card>
          <Ligne libelle="Nom" valeur={APP_NAME} />
          <Ligne libelle="Version" valeur="1.0.0" />
          {/* Utile en support : savoir sur quel backend pointe le téléphone. */}
          <Ligne libelle="Serveur" valeur={API_BASE_URL.replace(/^https?:\/\//, "")} />
        </Card>

        <Text className="mt-6 text-center text-xs text-gray-400">
          Go Gorée — liaison Dakar ↔ Île de Gorée
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
