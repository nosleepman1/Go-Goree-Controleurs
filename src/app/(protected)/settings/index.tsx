import { Ionicons } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { colors } from "@/constants/theme";

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
      </ScrollView>
    </SafeAreaView>
  );
}
