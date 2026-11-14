import { Ionicons } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PillButton } from "@/components/ui/PillButton";

export default function ScannerScreen() {
  const { boardingId } = useLocalSearchParams<{ boardingId: string }>();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Ionicons name="camera-outline" size={64} color="#6B7280" />
        <Text className="mt-4 text-center text-lg font-bold text-gray-900">
          Accès caméra nécessaire
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          Autorisez l'appareil photo pour scanner les QR codes des billets.
        </Text>
        <View className="mt-6 w-full max-w-xs">
          <PillButton label="Autoriser la caméra" onPress={requestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between p-4">
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>
        <Text className="text-lg font-bold text-white">Contrôle des billets</Text>
        <View style={{ width: 28 }} />
      </View>
      <View className="flex-1 items-center justify-center">
        <View className="h-64 w-64 rounded-3xl border-2 border-white/60" />
      </View>
    </SafeAreaView>
  );
}
