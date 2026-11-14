import { Text, View } from "react-native";

type Ton = "neutre" | "succes" | "alerte" | "danger" | "info";

const TONS: Record<Ton, { fond: string; texte: string }> = {
  neutre: { fond: "bg-gray-100", texte: "text-gray-700" },
  succes: { fond: "bg-emerald-100", texte: "text-emerald-700" },
  alerte: { fond: "bg-amber-100", texte: "text-amber-700" },
  danger: { fond: "bg-red-100", texte: "text-red-700" },
  info: { fond: "bg-blue-100", texte: "text-blue-700" },
};

export default function Badge({ label, ton = "neutre" }: { label: string; ton?: Ton }) {
  const { fond, texte } = TONS[ton];

  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${fond}`}>
      <Text className={`text-xs font-semibold ${texte}`}>{label}</Text>
    </View>
  );
}
