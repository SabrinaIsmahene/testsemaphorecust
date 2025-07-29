// packages/ssi-client/index.ts
export { createIssuer, issueAndSaveVC } from "./issuer"
export { createHolderDID, loadVC, verifyVC, generateIdentityFromVC } from "./holder"
export { verifyVC as verifierVerifyVC } from "./verifier"
