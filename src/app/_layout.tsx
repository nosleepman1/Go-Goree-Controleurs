import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { queryClient } from "@/lib/queryClient";
import AuthProvider from "@/providers/AuthProvider";
import "../global.css";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: "Oops!", headerShown: true }} />
        </Stack>
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  );
}
