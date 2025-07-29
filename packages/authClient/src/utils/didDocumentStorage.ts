import * as fs from "fs"
import * as fsp from "fs/promises"
import * as path from "path"
import { Resolver } from "did-resolver"
import { promisify } from "util"

const DID_DOCS_DIR = path.join(__dirname, "../storage/didDocuments")

// Fonction pour nettoyer un nom de fichier
function safeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]/g, "_")
}

export async function createAndSaveDIDDocument(
    didResolver: Resolver,
    didUrl: string,
    typeDid: "holder" | "issuer" // nouveau paramètre
): Promise<void> {
    // Résolution du DID Document
    const { didDocument } = await didResolver.resolve(didUrl)
    const { id: did } = didDocument ?? {}

    if (!did || !didDocument) {
        throw new Error("DID Document or ID not found.")
    }

    // Création du dossier s'il n'existe pas
    if (!fs.existsSync(DID_DOCS_DIR)) {
        await fsp.mkdir(DID_DOCS_DIR, { recursive: true })
    }

    // Extraire suffixe DID (ex: z6MkwBgMJDEGBrEXBa6hUmJHbQUwhmXhEkHdJuCLexBvNR6b)
    const parts = did.split(":")
    const didSuffix = parts[parts.length - 1] || "unknown"

    // Génération du nom de fichier sécurisé avec type (holder/issuer)
    const filename = `didkey_${typeDid}_${safeFilename(didSuffix)}.json`
    const filepath = path.join(DID_DOCS_DIR, filename)

    // Écriture du fichier JSON
    const writeFile = promisify(fs.writeFile)

    await writeFile(filepath, JSON.stringify(didDocument, null, 2), "utf-8")
    // console.log(`✅ DID Document for ${did} saved in file ${filepath}`)
}
