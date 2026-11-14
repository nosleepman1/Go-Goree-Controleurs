import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { gradients } from "@/constants/theme";
import { TextField } from "@/components/ui/TextField";
import { PillButton } from "@/components/ui/PillButton";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Valeurs d'entrée (jouées une seule fois)
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Valeur de pulsation douce (démarrée après l'entrée)
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Séquence d'entrée jouée une seule fois
    Animated.sequence([
      // Icône apparaît avec rebond
      Animated.parallel([
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      // Carte remonte avec fondu
      Animated.parallel([
        Animated.spring(cardTranslateY, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // 2. Pulsation douce démarrée APRÈS la fin de l'entrée
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.08,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  async function handleReset() {
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
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
            {/* Icône triste — entrée + pulsation séparées */}
            <Animated.View
              style={{ opacity: iconOpacity, transform: [{ scale: iconScale }] }}
              className="items-center mt-10 mb-4"
            >
              <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
                <View className="bg-white/10 rounded-full p-5 border border-white/20">
                  <Ionicons name="sad-outline" size={64} color="white" />
                </View>
              </Animated.View>
            </Animated.View>

            {/* Carte — révélée après l'icône */}
            <Animated.View
              style={{
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslateY }],
              }}
              className="flex-1 bg-white/[0.08] rounded-3xl p-6"
            >
              {!sent ? (
                <>
                  <Text className="text-[22px] font-bold text-white mb-2">
                    Mot de passe oublié ?
                  </Text>
                  <Text className="text-white/70 text-sm mb-6 leading-5">
                    Pas de panique. Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                  </Text>

                  <View className="mb-6">
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

                  <PillButton
                    label="Envoyer le lien"
                    variant="white"
                    loading={loading}
                    onPress={handleReset}
                  />
                </>
              ) : (
                <View className="items-center py-4">
                  <Ionicons name="checkmark-circle" size={52} color="white" />
                  <Text className="text-[20px] font-bold text-white mt-4 mb-2 text-center">
                    Email envoyé !
                  </Text>
                  <Text className="text-white/70 text-sm text-center leading-5">
                    Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
                  </Text>
                </View>
              )}

              {/* Retour */}
              <Pressable
                className="flex-row items-center justify-center mt-6"
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back-outline"
                  size={16}
                  color="rgba(255,255,255,0.8)"
                />
                <Text className="text-white/80 text-sm font-medium ml-1">
                  Retour à la connexion
                </Text>
              </Pressable>
            </Animated.View>

            <View className="h-8" />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
