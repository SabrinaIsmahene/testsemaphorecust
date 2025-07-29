// utils/storage.ts

import fs from "fs/promises"
import path from "path"

const STORAGE_DIR = path.join(__dirname, "../storage/VCs") // Assure-toi que ce dossier existe

async function ensureDir(dir: string) {
    try {
        await fs.mkdir(dir, { recursive: true })
    } catch (error) {
        console.warn(`⚠️ Failed to create directory: ${dir}`, error)
    }
}

// Sauvegarde un objet JSON dans un fichier
export async function saveJSON(filename: string, data: any) {
    await ensureDir(STORAGE_DIR)
    const filepath = path.join(STORAGE_DIR, filename)
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8")
}

// Charge un objet JSON depuis un fichier
export async function loadJSON<T>(filename: string): Promise<T | null> {
    const filepath = path.join(STORAGE_DIR, filename)
    try {
        const content = await fs.readFile(filepath, "utf-8")
        return JSON.parse(content) as T
    } catch (error) {
        console.warn(`⚠️ Failed to load JSON from ${filename}:`, error)
        return null
    }
}

// Génère un nom de fichier sécurisé à partir du numéro de série
export function makeVCFilename(serialNumber: string): string {
    const safeSerial = serialNumber.replace(/[^a-zA-Z0-9_-]/g, "_")
    return `vc_${safeSerial}.json`
}
