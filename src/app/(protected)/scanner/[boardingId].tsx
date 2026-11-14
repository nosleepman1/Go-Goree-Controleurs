import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PillButton } from "@/components/ui/PillButton";
import { colors } from "@/constants/theme";
import { useScanner } from "@/hooks/useScan";
import {
  EXPLICATIONS_RESULTAT,
  LIBELLES_RESULTAT,
  ResultatDeScan,
  ResultatScan,
} from "@/types/scan";

/** Chaque verdict a sa couleur et son icône : le contrôleur doit trancher d'un coup d'œil. */
const APPARENCE: Record<ResultatScan, { fond: string; icone: keyof typeof Ionicons.glyphMap }> = {
  VALIDE: { fond: "#059669", icone: "checkmark-circle" },
  DEJA_SCANNE: { fond: "#DC2626", icone: "alert-circle" },
  EXPIRE: { fond: "#D97706", icone: "time-outline" },
  MAUVAIS_VOYAGE: { fond: "#D97706", icone: "swap-horizontal" },
  NON_EMBARQUE: { fond: "#DC2626", icone: "close-circle" },
};

function PanneauVerdict({
  resultat,
  onSuivant,
}: {
  resultat: ResultatDeScan;
  onSuivant: () => void;
}) {
  const { fond, icone } = APPARENCE[resultat.resultat];

  return (
    <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: fond }}>
      <Ionicons name={icone} size={96} color="#FFFFFF" />
      <Text className="mt-4 text-3xl font-bold text-white">
        {LIBELLES_RESULTAT[resultat.resultat]}
      </Text>
      <Text className="mt-2 text-center text-base text-white/90">
        {EXPLICATIONS_RESULTAT[resultat.resultat]}
      </Text>

      {resultat.passager ? (
        <View className="mt-6 rounded-2xl bg-white/15 px-5 py-3">
          <Text className="text-center text-xs uppercase tracking-wider text-white/70">
            Passager
          </Text>
          <Text className="mt-0.5 text-center text-lg font-semibold text-white">
            {resultat.passager}
          </Text>
        </View>
      ) : null}

      <View className="mt-10 w-full">
        <PillButton label="Scanner le suivant" variant="white" onPress={onSuivant} />
      </View>
    </View>
  );
}

export default function ScannerScreen() {
  const { boardingId } = useLocalSearchParams<{ boardingId: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const scan = useScanner(String(boardingId));

  const [verdict, setVerdict] = useState<ResultatDeScan | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [compteur, setCompteur] = useState({ valides: 0, refuses: 0 });

  /**
   * Verrou synchrone.
   *
   * La caméra appelle onBarcodeScanned à chaque image tant que le QR reste
   * dans le cadre. Se fier à `scan.isPending` ne suffit pas : cet état ne
   * devient vrai qu'au rendu suivant, si bien que plusieurs images passent le
   * test avant que React ait rendu quoi que ce soit. Un seul billet partait
   * alors en une dizaine de requêtes — la première validait, les suivantes
   * revenaient « déjà scanné » et déclenchaient autant d'alertes de fraude
   * contre un passager parfaitement honnête.
   *
   * Une ref est mise à jour immédiatement : la deuxième image est bloquée.
   */
  const verrou = useRef(false);

  const enPause = scan.isPending || verdict !== null || erreur !== null;

  const traiterCode = (qrToken: string) => {
    if (verrou.current || enPause) return;
    verrou.current = true;

    setErreur(null);
    scan.mutate(qrToken, {
      onSuccess: (resultat) => {
        setVerdict(resultat);
        setCompteur((c) =>
          resultat.resultat === "VALIDE"
            ? { ...c, valides: c.valides + 1 }
            : { ...c, refuses: c.refuses + 1 }
        );
      },
      // Ici on ne récupère que les vraies pannes : réseau, session fermée (409),
      // session expirée. Les billets refusés arrivent en succès, avec verdict.
      onError: (error) => setErreur(error.message),
    });
  };

  // Le verrou n'est relâché que sur action explicite du contrôleur : tant que
  // le verdict est affiché, le billet peut rester sous l'objectif sans être
  // rescanné.
  const reprendre = () => {
    verrou.current = false;
    setVerdict(null);
    setErreur(null);
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="camera-outline" size={56} color={colors.textGray} />
          <Text className="mt-4 text-center text-lg font-bold text-gray-900">
            Accès à la caméra nécessaire
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-500">
            Le scan des billets à l'embarquement passe par l'appareil photo.
          </Text>

          <View className="mt-8 w-full">
            {permission.canAskAgain ? (
              <PillButton label="Autoriser la caméra" onPress={requestPermission} />
            ) : (
              <Text className="text-center text-sm text-gray-500">
                L'autorisation a été refusée définitivement. Activez la caméra pour Go Gorée
                dans les réglages de votre téléphone.
              </Text>
            )}
          </View>

          <Pressable onPress={() => router.back()} className="mt-6 p-2">
            <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
              Retour
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (verdict) {
    return <PanneauVerdict resultat={verdict} onSuivant={reprendre} />;
  }

  if (erreur) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900 px-8">
        <Ionicons name="cloud-offline-outline" size={72} color="#FFFFFF" />
        <Text className="mt-4 text-center text-xl font-bold text-white">Scan impossible</Text>
        <Text className="mt-2 text-center text-base text-white/80">{erreur}</Text>
        <View className="mt-8 w-full">
          <PillButton label="Réessayer" variant="white" onPress={reprendre} />
        </View>
        <Pressable onPress={() => router.back()} className="mt-4 p-2">
          <Text className="text-sm font-semibold text-white/80">Revenir à l'embarquement</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={enPause ? undefined : ({ data }) => traiterCode(data)}
      >
        <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
          <View className="flex-row items-center justify-between px-4 pt-2">
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>

            <View className="rounded-full bg-black/50 px-4 py-2">
              <Text className="text-sm font-semibold text-white">
                {compteur.valides} validé{compteur.valides > 1 ? "s" : ""} · {compteur.refuses}{" "}
                refusé{compteur.refuses > 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          <View className="flex-1 items-center justify-center">
            <View className="h-64 w-64 rounded-3xl border-4 border-white/80" />
            <Text className="mt-6 text-center text-base text-white">
              {scan.isPending ? "Vérification…" : "Présentez le QR code du billet"}
            </Text>
            {scan.isPending ? <ActivityIndicator className="mt-3" color="#FFFFFF" /> : null}
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
