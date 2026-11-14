import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { colors } from "@/constants/theme";
import {
  useEmbarquements,
  useOuvrirEmbarquement,
  useVoyagesDuJour,
} from "@/hooks/useEmbarquements";
import { Embarquement } from "@/types/boarding";
import { VoyageDuJour } from "@/api/voyage.api";

function LigneEmbarquement({ item }: { item: Embarquement }) {
  return (
    <Pressable
      onPress={() => router.push(`/(protected)/boardings/${item.id}`)}
      accessibilityRole="button"
      className="mb-3 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4"
    >
      <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-blue-50">
        <Ionicons name="boat-outline" size={22} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{item.chaloupe}</Text>
        <Text className="mt-0.5 text-sm text-gray-500">
          {item.heureDepart ? `Départ ${item.heureDepart}` : "Horaire non renseigné"}
          {item.placesRestantes != null && item.places != null
            ? ` · ${item.places - item.placesRestantes}/${item.places} embarqués`
            : ""}
        </Text>
      </View>
      <Badge label="Ouvert" ton="succes" />
    </Pressable>
  );
}

function LigneVoyage({
  voyage,
  onOuvrir,
  enCours,
}: {
  voyage: VoyageDuJour;
  onOuvrir: () => void;
  enCours: boolean;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4">
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {voyage.heureDepart || "—"} · {voyage.chaloupe}
        </Text>
        <Text className="mt-0.5 text-sm text-gray-500">
          {voyage.placesRestantes}/{voyage.places} places restantes
        </Text>
      </View>
      <Pressable
        onPress={onOuvrir}
        disabled={enCours}
        accessibilityRole="button"
        className="rounded-full px-4 py-2"
        style={{ backgroundColor: colors.primary, opacity: enCours ? 0.6 : 1 }}
      >
        {enCours ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text className="text-sm font-semibold text-white">Ouvrir</Text>
        )}
      </Pressable>
    </View>
  );
}

export default function BoardingsScreen() {
  const embarquements = useEmbarquements();
  const voyages = useVoyagesDuJour();
  const ouvrir = useOuvrirEmbarquement();

  const ouvrirEmbarquement = (voyageId: string) => {
    ouvrir.mutate(voyageId, {
      onSuccess: (session) => {
        router.push(`/(protected)/boardings/${session.id}`);
      },
      onError: (error) => {
        Toast.show({ type: "error", text1: "Ouverture impossible", text2: error.message });
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-5 pb-2 pt-4">
        <Text className="text-2xl font-bold text-gray-900">Embarquements</Text>
        <Text className="mt-0.5 text-sm text-gray-500">
          Sessions ouvertes et voyages du jour
        </Text>
      </View>

      <FlatList
        data={embarquements.data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={embarquements.isRefetching}
            onRefresh={() => {
              embarquements.refetch();
              voyages.refetch();
            }}
          />
        }
        renderItem={({ item }) => <LigneEmbarquement item={item} />}
        ListEmptyComponent={
          embarquements.isPending ? (
            <View className="py-12">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : embarquements.isError ? (
            <ErrorState
              message={(embarquements.error as Error).message}
              onRetry={() => embarquements.refetch()}
            />
          ) : (
            <EmptyState
              icon="boat-outline"
              title="Aucune session ouverte"
              message="Ouvrez l'embarquement d'un voyage ci-dessous pour commencer à scanner."
            />
          )
        }
        ListFooterComponent={
          <View className="mt-4">
            <Text className="mb-3 text-base font-semibold text-gray-900">Voyages du jour</Text>

            {voyages.isPending ? (
              <ActivityIndicator color={colors.primary} />
            ) : voyages.isError ? (
              <ErrorState
                message={(voyages.error as Error).message}
                onRetry={() => voyages.refetch()}
              />
            ) : voyages.data && voyages.data.length > 0 ? (
              voyages.data.map((voyage) => (
                <LigneVoyage
                  key={voyage.id}
                  voyage={voyage}
                  enCours={ouvrir.isPending && ouvrir.variables === voyage.id}
                  onOuvrir={() => ouvrirEmbarquement(voyage.id)}
                />
              ))
            ) : (
              <EmptyState
                icon="calendar-outline"
                title="Aucun voyage aujourd'hui"
                message="La génération automatique planifie les voyages des 7 prochains jours."
              />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}
