/** Verdicts renvoyés par POST /scans (ResultatScanEnum côté backend). */
export type ResultatScan =
  | "VALIDE"
  | "DEJA_SCANNE"
  | "EXPIRE"
  | "NON_EMBARQUE"
  | "MAUVAIS_VOYAGE";

export interface ApiScan {
  id: string;
  resultat: ResultatScan;
  billet_id: string;
  embarquement_id: string;
  scanne_par: string;
  created_at: string;
  billet?: { id: string; qr_token?: string; statut?: string } | null;
}

/**
 * Résultat d'un scan tel que consommé par l'écran.
 *
 * Un billet refusé n'est pas une erreur technique : c'est l'issue normale d'un
 * scan. La couche API convertit donc les 422/404 du backend en verdict, et ne
 * laisse remonter en exception que les vraies pannes (réseau, session fermée).
 */
export interface ResultatDeScan {
  resultat: ResultatScan;
  message: string;
  passager?: string;
  scanId?: string;
}

export interface ScanHistorique {
  id: string;
  resultat: ResultatScan;
  horodatage: string;
  billetId: string;
}

/** Libellés affichés à l'écran, alignés sur ResultatScanEnum::label(). */
export const LIBELLES_RESULTAT: Record<ResultatScan, string> = {
  VALIDE: "Valide",
  DEJA_SCANNE: "Déjà scanné",
  EXPIRE: "Expiré",
  NON_EMBARQUE: "Non embarqué",
  MAUVAIS_VOYAGE: "Mauvais voyage",
};

/** Explication courte, pour que le contrôleur sache quoi faire. */
export const EXPLICATIONS_RESULTAT: Record<ResultatScan, string> = {
  VALIDE: "Le passager peut embarquer.",
  DEJA_SCANNE: "Ce billet a déjà été utilisé pour cet embarquement.",
  EXPIRE: "Ce billet a expiré, il n'est plus valable.",
  NON_EMBARQUE: "Billet inconnu ou non payé.",
  MAUVAIS_VOYAGE: "Ce billet est valable pour un autre voyage.",
};
