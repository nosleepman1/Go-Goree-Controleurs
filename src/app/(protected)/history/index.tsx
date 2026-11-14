import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Badge from "@/components/ui/Badge";
import ErrorState from "@/components/ui/ErrorState";
import { colors } from "@/constants/theme";
import { useHistoriqueScans } from "@/hooks/useScan";
import { LIBELLES_RESULTAT, ResultatScan } from "@/types/scan";

const TON: Record<ResultatScan, "succes" | "danger" | "alerte"> = {
  VALIDE: "succes",
  DEJA_SCANNE: "danger",
  NON_EMBARQUE: "danger",
  EXPIRE: "alerte",
  MAUVAIS_VOYAGE: "alerte",
};

export default function HistoryScreen() {
  const scans = useHistoriqueScans();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold text-gray-900">Historique</Text>
        <Text className="mt-0.5 text-sm text-gray-500">Scans les plus récents</Text>
      </View>

      <FlatList
        data={scans.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View className="mb-3 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900">
                {new Date(item.horodatage).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text className="mt-0.5 text-xs text-gray-400">
                Billet {item.billetId.slice(0, 8)}
              </Text>
            </View>
            <Badge label={LIBELLES_RESULTAT[item.resultat]} ton={TON[item.resultat]} />
          </View>
        )}
        ListEmptyComponent={
          scans.isPending ? (
            <View className="py-12">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : scans.isError ? (
            <ErrorState message={(scans.error as Error).message} onRetry={() => scans.refetch()} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}
