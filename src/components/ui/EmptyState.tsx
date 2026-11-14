import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { colors } from "@/constants/theme";

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function EmptyState({ title, message, icon = "file-tray-outline" }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-8 py-12">
      <Ionicons name={icon} size={44} color={colors.textGray} />
      <Text className="mt-3 text-center text-base font-semibold text-gray-800">{title}</Text>
      {message ? (
        <Text className="mt-1 text-center text-sm text-gray-500">{message}</Text>
      ) : null}
    </View>
  );
}
