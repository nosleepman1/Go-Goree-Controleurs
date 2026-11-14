import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BoardingsScreen() {
  const [onglet, setOnglet] = useState<"en_cours" | "a_venir">("en_cours");

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold text-gray-900">Embarquements</Text>
        <Text className="mt-0.5 text-sm text-gray-500">Gérez les sessions de contrôle</Text>
      </View>

      <View className="flex-row px-5 py-3">
        <Pressable
          onPress={() => setOnglet("en_cours")}
          accessibilityRole="tab"
          className={`mr-2 rounded-full px-4 py-2 ${onglet === "en_cours" ? "bg-blue-600" : "bg-gray-200"}`}
        >
          <Text className={`text-sm font-semibold ${onglet === "en_cours" ? "text-white" : "text-gray-700"}`}>
            En cours
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setOnglet("a_venir")}
          accessibilityRole="tab"
          className={`rounded-full px-4 py-2 ${onglet === "a_venir" ? "bg-blue-600" : "bg-gray-200"}`}
        >
          <Text className={`text-sm font-semibold ${onglet === "a_venir" ? "text-white" : "text-gray-700"}`}>
            Voyages du jour
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
