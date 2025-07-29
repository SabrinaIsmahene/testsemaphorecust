import fs from "fs"
import path from "path"
import { Identity } from "@semaphore-protocol/identity"

const IDENTITIES_DIR = path.join(__dirname, "../storage/identities")

// Sauvegarde une identité dans un fichier JSON
export function saveIdentity(identity: Identity, filename: string) {
    if (!fs.existsSync(IDENTITIES_DIR)) {
        fs.mkdirSync(IDENTITIES_DIR, { recursive: true })
    }

    // On utilise la méthode officielle export() pour la clé privée
    const privateKeyString = identity.export()

    const json = {
        privateKey: privateKeyString,
        commitment: identity.commitment.toString()
    }

    const filePath = path.join(IDENTITIES_DIR, `${filename}.json`)
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2))

    // console.log(`✅ Identity saved at ${filePath}`)
}

// Charge une identité à partir d'un fichier JSON
export function loadIdentity(filename: string): Identity {
    const filePath = path.join(IDENTITIES_DIR, `${filename}.json`)

    if (!fs.existsSync(filePath)) {
        throw new Error(`❌ Identity file not found: ${filePath}`)
    }

    const raw = fs.readFileSync(filePath, "utf-8")
    const { privateKey } = JSON.parse(raw)

    return Identity.import(privateKey)
}
