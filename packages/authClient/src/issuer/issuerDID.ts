import { DID } from "dids"
import { Ed25519Provider } from "key-did-provider-ed25519"
import { getResolver as keyResolver } from "key-did-resolver"
import { randomBytes } from "@noble/hashes/utils"
import { EdDSASigner } from "did-jwt"
import { Resolver } from "did-resolver"
import { createAndSaveDIDDocument } from "../utils/didDocumentStorage"

export async function createIssuer(): Promise<{ did: string; signer: any; alg: string; didInstance: DID }> {
    const seed = randomBytes(32)
    const provider = new Ed25519Provider(seed)
    const didInstance = new DID({
        provider,
        resolver: keyResolver()
    })

    await didInstance.authenticate()

    const resolver = new Resolver({ ...keyResolver() })
    await createAndSaveDIDDocument(resolver, didInstance.id, "issuer") // <-- Passer resolver + did string

    const signer = EdDSASigner(seed)

    return {
        did: didInstance.id,
        signer,
        alg: "EdDSA",
        didInstance
    }
}
