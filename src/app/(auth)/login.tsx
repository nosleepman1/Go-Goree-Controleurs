import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { gradients } from "@/constants/theme";
import { TextField } from "@/components/ui/TextField";
import { PillButton } from "@/components/ui/PillButton";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setError(null);
      setLoading(true);
      await login({ email, password });
      router.replace("/(protected)/home");
    } catch (err) {
      setError((err as { message: string }).message ?? "Connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={gradients.primary} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View className="items-center mt-6 mb-3">
              <Image
                source={require("../../assets/logo.png")}
                className="w-[150px] h-[150px]"
                resizeMode="contain"
              />
            </View>

            {/* Carte de connexion */}
            <View className="flex-1 bg-white/[0.0] rounded-3xl p-6">
              <Text className="text-[22px] font-bold text-white mb-5">
                Connexion
              </Text>

              {/* Champs de saisie */}
              <View>
                <View className="mb-[14px]">
                  <TextField
                    icon="mail-outline"
                    variant="onBlue"
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                <TextField
                  icon="lock-closed-outline"
                  variant="onBlue"
                  placeholder="Mot de passe"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Mot de passe oublié */}
              <Pressable 
                className="self-end mt-3 mb-6"
                onPress={() => router.push("/(auth)/forgot-password")}
                >
                <Text className="text-[13px] text-white/85">
                  Mot de passe oublié ?
                </Text>
              </Pressable>

              {/* Erreur */}
              {error ? (
                <Text className="text-red-300 mb-3">{error}</Text>
              ) : null}

              {/* Bouton connexion */}
              <PillButton
                label="Connexion"
                variant="white"
                loading={loading}
                onPress={handleSubmit}
              />

            </View>

            {/* Inscription désactivée pour l'application contrôleurs */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
