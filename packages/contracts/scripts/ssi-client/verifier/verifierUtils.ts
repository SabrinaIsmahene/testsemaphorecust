// verifier/verifierUtils.ts

import { verifyProof as semaphoreVerifyProof } from "@semaphore-protocol/proof" // ou le module Semaphore que tu utilises
import { verifyCredential } from "did-jwt-vc"
import type { Resolvable } from "did-resolver"

// Vérifie une preuve Semaphore (adapter selon ta bibliothèque)
export async function verifyProof(proof: any): Promise<boolean> {
    try {
        return await semaphoreVerifyProof(proof)
    } catch (error) {
        console.error("Erreur lors de la vérification de la preuve Semaphore:", error)
        return false
    }
}

// Vérifie la validité d'un Verifiable Credential (VC) JWT via un resolver DID
export async function verifyVC(vcJwt: string, resolver: Resolvable): Promise<boolean> {
    try {
        await verifyCredential(vcJwt, resolver)
        return true
    } catch (error) {
        console.error("Erreur lors de la vérification du VC:", error)
        return false
    }
}
