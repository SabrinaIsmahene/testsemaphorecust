import { DID } from "dids"
import { Ed25519Provider } from "key-did-provider-ed25519"
import { getResolver as keyResolver } from "key-did-resolver"
import { randomBytes } from "@noble/hashes/utils"
import { Resolver } from "did-resolver"
import { createAndSaveDIDDocument } from "../utils/didDocumentStorage"

export async function createHolderDID(): Promise<{ did: string; didInstance: DID }> {
    const seed = randomBytes(32)
    const provider = new Ed25519Provider(seed)
    const didInstance = new DID({
        provider,
        resolver: keyResolver()
    })

    await didInstance.authenticate()

    const resolver = new Resolver({ ...keyResolver() })
    await createAndSaveDIDDocument(resolver, didInstance.id, "holder") // <-- Passer resolver + did string

    return {
        did: didInstance.id,
        didInstance
    }
}
