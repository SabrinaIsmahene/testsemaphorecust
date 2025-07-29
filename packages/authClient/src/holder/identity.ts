import { createHash } from "crypto"
import { Identity } from "@semaphore-protocol/identity"
import type { VerifiedVC } from "./types"
import { loadIdentity, saveIdentity } from "../utils/identityStorage"

// Fonction pour générer l'identité Semaphore à partir du VC vérifié
export function generateIdentityFromVC(vc: VerifiedVC) {
    const { serial, mac } = vc

    // Générer un nom de fichier basé sur serial
    const filename = `id_${serial.replace(/[^a-zA-Z0-9_-]/g, "_")}`

    let identity: Identity

    try {
        // 1. Tenter de charger une identité existante
        identity = loadIdentity(filename)
        // console.log('ℹ️ Identity loaded from file.')
    } catch (error) {
        // 2. Si le fichier n'existe pas ou erreur de chargement => générer nouvelle identité
        // console.log('⚠️ Identity file not found or error loading, generating new identity.')
        const secret = `${serial}-${mac}`
        const hashedBuffer = createHash("sha256").update(secret).digest()
        identity = new Identity(hashedBuffer)

        // 3. Sauvegarder l'identité nouvellement créée
        saveIdentity(identity, filename)
        // console.log('🆕 New identity generated and saved.')
    }

    // Étape 4 : renvoyer identité + commitment
    return {
        identity,
        commitment: identity.commitment // BigInt
    }
}
