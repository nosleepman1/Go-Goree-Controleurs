import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Card from "@/components/ui/Card";
import { colors } from "@/constants/theme";

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
      <Text className="text-sm text-gray-500">{libelle}</Text>
      <Text className="text-sm font-semibold text-gray-900">{valeur}</Text>
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="mb-4 text-2xl font-bold text-gray-900">Réglages</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
