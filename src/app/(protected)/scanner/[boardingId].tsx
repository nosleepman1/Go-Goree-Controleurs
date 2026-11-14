import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScannerScreen() {
  const { boardingId } = useLocalSearchParams<{ boardingId: string }>();

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
