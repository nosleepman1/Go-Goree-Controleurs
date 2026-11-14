import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Card from "@/components/ui/Card";
import { useEmbarquements } from "@/hooks/useEmbarquements";

export default function BoardingDetailScreen() {
  const { boardingId } = useLocalSearchParams<{ boardingId: string }>();
  const { data: embarquements = [] } = useEmbarquements();
  const embarquement = embarquements.find((e) => e.id === boardingId);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-2xl font-bold text-gray-900">{embarquement?.chaloupe ?? "Embarquement"}</Text>
        <Text className="mt-1 text-sm text-gray-500">Détails de la session</Text>

        <Card className="mt-4">
          <View className="py-2">
            <Text className="text-sm text-gray-500">Passagers embarqués</Text>
            <Text className="mt-1 text-3xl font-bold text-gray-900">
              {embarquement?.passagersEmbarques ?? 0}
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
