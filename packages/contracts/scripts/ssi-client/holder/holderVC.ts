import { verifyCredential } from "did-jwt-vc"
import type { Resolvable } from "did-resolver"
import type { VerifiedVC } from "./types"

export async function verifyVC(vcJwt: string, resolver: Resolvable): Promise<VerifiedVC> {
    const verified = await verifyCredential(vcJwt, resolver)
    const credential = verified.verifiableCredential
    const { serial, mac, id: holderDid } = credential.credentialSubject

    if (!holderDid) {
        throw new Error("holderDid missing in VC")
    }

    return {
        serial,
        mac,
        holderDid,
        vcJwt
    }
}
