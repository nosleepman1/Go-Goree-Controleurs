import { ActivityIndicator, Text, View } from "react-native";

import { colors } from "@/constants/theme";

export default function Loading({ message }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text className="mt-3 text-sm text-gray-500">{message}</Text> : null}
    </View>
  );
}
