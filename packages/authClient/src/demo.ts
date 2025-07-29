// packages/ssi-client/demo.ts
import { Resolver } from "did-resolver"
import { getResolver as keyResolver } from "key-did-resolver"
import {
    createIssuer,
    issueAndSaveVC,
    createHolderDID,
    loadVC,
    verifyVC,
    generateIdentityFromVC,
    verifierVerifyVC
} from "./index"

export async function simulateDeviceWorkflow(deviceInfo: { serial: string; mac: string }) {
    const resolver = new Resolver({ ...keyResolver() })

    const issuer = await createIssuer()
    const holder = await createHolderDID()

    const vcJwt = await issueAndSaveVC(issuer, holder.did, deviceInfo)
    const storedVC = await loadVC(deviceInfo.serial)
    const verifiedVC = await verifyVC(storedVC, resolver)

    const { identity, commitment } = generateIdentityFromVC(verifiedVC)
    const isVCValid = await verifierVerifyVC(vcJwt, resolver)

    return {
        holderDID: holder.did,
        commitment,
        isVCValid,
        identity
    }
}
