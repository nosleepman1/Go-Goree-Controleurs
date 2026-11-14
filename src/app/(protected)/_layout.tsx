import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

import Loading from "@/components/ui/Loading";
import { colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // Garde de session : plus de redirection inconditionnelle. Un 401 sur une
  // requête authentifiée vide le jeton et repasse ici, ce qui renvoie
  // automatiquement au login.
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textGray,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="boardings/index"
        options={{
          title: "Embarquements",
          tabBarIcon: ({ color, size }) => <Ionicons name="boat-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history/index"
        options={{
          title: "Historique",
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Réglages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Écrans de détail et de scan : accessibles par navigation, hors barre d'onglets. */}
      <Tabs.Screen name="boardings/[boardingId]" options={{ href: null }} />
      <Tabs.Screen
        name="scanner/[boardingId]"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
    </Tabs>
  );
}
