import { ReactNode } from "react";
import { View } from "react-native";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <View className={`rounded-2xl border border-gray-200 bg-white p-4 ${className}`}>{children}</View>
  );
}
