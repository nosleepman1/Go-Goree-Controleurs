import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ErrorState from "@/components/ui/ErrorState";
import { PillButton } from "@/components/ui/PillButton";
import { colors } from "@/constants/theme";
import { useEmbarquements, useFermerEmbarquement } from "@/hooks/useEmbarquements";

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <View className="flex-row items-center justify-between border-b border-gray-100 py-3">
      <Text className="text-sm text-gray-500">{libelle}</Text>
      <Text className="text-sm font-semibold text-gray-900">{valeur}</Text>
    </View>
  );
}

export default function BoardingDetailScreen() {
  const { boardingId } = useLocalSearchParams<{ boardingId: string }>();
  const embarquements = useEmbarquements();
  const fermer = useFermerEmbarquement();

  // La liste des sessions ouvertes est déjà en cache : on y lit la session
  // plutôt que d'ajouter un endpoint de détail qui n'existe pas côté backend.
  const session = embarquements.data?.find((item) => item.id === boardingId);

  const confirmerFermeture = () => {
    Alert.alert(
      "Fermer la session ?",
      "Plus aucun billet ne pourra être scanné sur cet embarquement.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Fermer",
          style: "destructive",
          onPress: () =>
            fermer.mutate(String(boardingId), {
              onSuccess: () => {
                Toast.show({ type: "success", text1: "Session fermée" });
                router.back();
              },
              onError: (error) =>
                Toast.show({
                  type: "error",
                  text1: "Fermeture impossible",
                  text2: error.message,
                }),
            }),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="flex-row items-center px-4 pb-2 pt-2">
        <Pressable onPress={() => router.back()} accessibilityRole="button" className="p-2">
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </Pressable>
        <Text className="ml-1 text-xl font-bold text-gray-900">Embarquement</Text>
      </View>

      {embarquements.isPending ? (
        <View className="py-12">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : embarquements.isError ? (
        <ErrorState
          message={(embarquements.error as Error).message}
          onRetry={() => embarquements.refetch()}
        />
      ) : !session ? (
        <ErrorState
          message="Cette session n'est plus ouverte — un autre contrôleur l'a peut-être fermée."
          onRetry={() => embarquements.refetch()}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Card>
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">{session.chaloupe}</Text>
              <Badge
                label={session.statut === "OUVERT" ? "Ouvert" : "Fermé"}
                ton={session.statut === "OUVERT" ? "succes" : "neutre"}
              />
            </View>

            <Ligne libelle="Départ" valeur={session.heureDepart || "—"} />
            <Ligne
              libelle="Places"
              valeur={
                session.places != null && session.placesRestantes != null
                  ? `${session.places - session.placesRestantes} embarqués / ${session.places}`
                  : "—"
              }
            />
            <Ligne
              libelle="Ouverte à"
              valeur={session.ouvertA ? new Date(session.ouvertA).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              }) : "—"}
            />
          </Card>

          <View className="mt-6">
            <PillButton
              label="Scanner les billets"
              onPress={() => router.push(`/(protected)/scanner/${session.id}`)}
            />
          </View>

          <View className="mt-3">
            <PillButton
              label="Fermer la session"
              variant="outline"
              loading={fermer.isPending}
              onPress={confirmerFermeture}
            />
          </View>

          <Text className="mt-4 text-center text-xs text-gray-400">
            Plusieurs contrôleurs peuvent scanner sur la même session.
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
