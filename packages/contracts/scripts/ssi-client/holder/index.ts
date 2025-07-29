import { createHolderDID } from "./holderDID"
import { verifyVC } from "./holderVC"
import { generateIdentityFromVC } from "./identity"
import { loadJSON } from "../utils/VCsStorage"
import type { DeviceInfo, VerifiedVC } from "./types"
import { loadIdentity, saveIdentity } from "../utils/identityStorage" // Import des fonctions

// Dossier de stockage des identités

// ✅ Charge un VC JWT à partir du numéro de série
export async function loadVC(serial: string): Promise<string> {
    const safeSerial = serial.replace(/[^a-zA-Z0-9_-]/g, "_")
    const filename = `vc_${safeSerial}.json`
    const data = await loadJSON<{ vcJwt: string }>(filename)

    if (!data) throw new Error(`VC not found for serial number: ${serial}`)
    return data.vcJwt
}

export { createHolderDID, verifyVC, generateIdentityFromVC, loadIdentity, saveIdentity }
export type { DeviceInfo, VerifiedVC }
