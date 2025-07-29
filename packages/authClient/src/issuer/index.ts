import { createIssuer } from "./issuerDID"
import { issueVC } from "./issuerVC"
import { saveJSON, makeVCFilename } from "../utils/VCsStorage" // Import groupé
import type { Issuer, DeviceInfo } from "./types"

// issuer est un objet Issuer, déjà résolu (pas une Promise)
export async function issueAndSaveVC(issuer: Issuer, holderDid: string, deviceInfo: DeviceInfo): Promise<string> {
    // Émettre le VC signé
    const vcJwt = await issueVC(issuer, holderDid, deviceInfo)

    // Sauvegarder le VC dans un fichier JSON (nom fichier sécurisé)
    const filename = makeVCFilename(deviceInfo.serial)
    await saveJSON(filename, { vcJwt })

    // Retourner le JWT si besoin
    return vcJwt
}

export { createIssuer, issueVC }
export type { Issuer, DeviceInfo }
