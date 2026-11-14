import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PillButton } from "@/components/ui/PillButton";
import { ResultatDeScan, ResultatScan } from "@/types/scan";

const APPARENCE: Record<ResultatScan, { fond: string; icone: keyof typeof Ionicons.glyphMap }> = {
  VALIDE: { fond: "#059669", icone: "checkmark-circle" },
  DEJA_SCANNE: { fond: "#DC2626", icone: "alert-circle" },
  EXPIRE: { fond: "#D97706", icone: "time-outline" },
  MAUVAIS_VOYAGE: { fond: "#D97706", icone: "boat-outline" },
  NON_EMBARQUE: { fond: "#DC2626", icone: "close-circle" },
};

export default function ScannerScreen() {
  const { boardingId } = useLocalSearchParams<{ boardingId: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [resultat, setResultat] = useState<ResultatDeScan | null>(null);

  if (!permission?.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Ionicons name="camera-outline" size={64} color="#6B7280" />
        <Text className="mt-4 text-center text-lg font-bold text-gray-900">Accès caméra nécessaire</Text>
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

      {resultat && (
        <View
          className="absolute inset-x-5 bottom-8 rounded-3xl p-6 shadow-2xl"
          style={{ backgroundColor: APPARENCE[resultat.verdict].fond }}
        >
          <Text className="text-xl font-bold text-white">{resultat.verdict}</Text>
          <Pressable onPress={() => setResultat(null)} className="mt-4 rounded-xl bg-white/20 py-2">
            <Text className="text-center font-bold text-white">Billet suivant</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
