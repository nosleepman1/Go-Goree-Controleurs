import { api, ApiError, endpoints } from "@/api/client";
import { Paginated } from "@/types/api";
import { ApiScan, ResultatDeScan, ResultatScan, ScanHistorique } from "@/types/scan";

interface ReponseScan {
  message?: string;
  resultat?: ResultatScan;
  scan?: { id: string };
  // Pas d'enveloppe "data" : BilletResource est imbriquée dans le tableau de
  // réponse, le wrapping Laravel ne s'applique qu'au premier niveau.
  billet?: { user?: { prenom?: string; nom?: string } | null } | null;
}

export const ticketApi = {
  /**
   * POST /scans — valide un billet sur une session d'embarquement.
   *
   * Le backend répond 200 pour un billet valide, mais **422** pour un billet
   * refusé (déjà scanné, expiré, mauvais voyage) et **404** pour un QR inconnu,
   * en plaçant le verdict dans le corps. Or un billet refusé est une issue
   * normale du métier, pas une panne : on accepte donc ces statuts pour lire le
   * verdict, et on ne laisse remonter en exception que ce qui empêche
   * réellement de scanner (réseau, 401, et le 409 « session fermée »).
   */
  async scanner(qrToken: string, embarquementId: string): Promise<ResultatDeScan> {
    const response = await api.post<ReponseScan>(
      endpoints.scans.create,
      { qr_token: qrToken, embarquement_id: embarquementId },
      { validateStatus: (status) => status === 200 || status === 404 || status === 422 }
    );

    const { resultat, message, scan } = response.data;

    if (!resultat) {
      throw new ApiError(message ?? "Réponse de scan inattendue.", { status: response.status });
    }

    const passager = response.data.billet?.user;

    return {
      resultat,
      message: message ?? "",
      passager: passager ? `${passager.prenom ?? ""} ${passager.nom ?? ""}`.trim() : undefined,
      scanId: scan?.id,
    };
  },

  /** GET /scans — historique paginé, du plus récent au plus ancien. */
  async historique(): Promise<ScanHistorique[]> {
    const { data } = await api.get<Paginated<ApiScan>>(endpoints.scans.list);

    return (data.data ?? []).map((scan) => ({
      id: scan.id,
      resultat: scan.resultat,
      horodatage: scan.created_at,
      billetId: scan.billet_id,
    }));
  },
};
