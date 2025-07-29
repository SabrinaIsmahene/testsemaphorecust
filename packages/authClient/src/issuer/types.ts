import type { Issuer as DIDIssuer } from "did-jwt-vc"

export interface DeviceInfo {
    serial: string
    mac: string
}
export type Issuer = DIDIssuer
