import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LIBELLES_RESULTAT, ResultatScan } from "@/types/scan";

const TON: Record<ResultatScan, "succes" | "danger" | "alerte"> = {
  VALIDE: "succes",
  DEJA_SCANNE: "danger",
  NON_EMBARQUE: "danger",
  EXPIRE: "alerte",
  MAUVAIS_VOYAGE: "alerte",
};

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold text-gray-900">Historique</Text>
        <Text className="mt-0.5 text-sm text-gray-500">Scans les plus récents</Text>
      </View>
    </SafeAreaView>
  );
}
