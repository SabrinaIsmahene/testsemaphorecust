/*
***** simulation un issuer, un holder, sans semaphore sans sauvegarde dans fichier json *****


import { Resolver } from 'did-resolver'
import { getResolver as keyResolver } from 'key-did-resolver'

import { createIssuer, issueVC } from './issuer'
import { createHolderDID, verifyVC, generateIdentityFromVC } from './holder'
import { verifyProof, verifyVC as verifierVerifyVC } from './verifier'

async function main() {
  console.log('➡️ 1. Création du Resolver DID')
  const resolver = new Resolver({
    ...keyResolver()
  })
  console.log('Resolver DID prêt\n')

  console.log('➡️ 2. Création de l\'Issuer')
  const issuer = await createIssuer()
  console.log(`Issuer DID: ${issuer.did}\n`)

  console.log('➡️ 3. Création du Holder DID (device)')
  const holderDidInstance = await createHolderDID()
  const holderDid = holderDidInstance.id
  console.log(`Holder DID: ${holderDid}\n`)

  console.log('➡️ 4. Préparation des informations device')
  const deviceInfo = {
    serial: 'SN-000123456789',
    mac: 'AA:BB:CC:DD:EE:FF'
  }
  console.log('Device info:', deviceInfo, '\n')

  console.log('➡️ 5. Issuer émet un Verifiable Credential (VC) pour le Holder')
  const vcJwt = await issueVC(issuer, holderDid, deviceInfo)
  console.log('VC JWT émis:', vcJwt, '\n')

  console.log('➡️ 6. Holder vérifie le VC reçu')
  const holderVerifiedVC = await verifyVC(vcJwt, resolver)
  console.log('VC vérifié côté Holder:', holderVerifiedVC, '\n')

  console.log('➡️ 7. Holder génère identité Semaphore à partir du VC vérifié')
  const identity = generateIdentityFromVC(holderVerifiedVC)
  console.log('Identité Semaphore générée:', identity, '\n')

  console.log('➡️ 8. Verifier vérifie la validité du VC (simulation)')
  const verifierVCValid = await verifierVerifyVC(vcJwt, resolver)
  console.log('VC validé côté Verifier:', verifierVCValid, '\n')

  // Décommenter et compléter lorsque preuve Semaphore implémentée
  // console.log('➡️ 9. Verifier vérifie la preuve Semaphore')
  // const proofValid = await verifyProof(identity.semaphoreProof)
  // console.log('Preuve Semaphore validée:', proofValid, '\n')

  console.log('✅ Workflow SSI + Semaphore terminé avec succès')
}

main().catch(err => {
  console.error('❌ Erreur dans le workflow SSI:', err)
})

*/

/*

***** simulation plusieurs holder avec un seul issuer sans semaphore sans sauvegarde dans fichier json ***** 
import { Resolver } from 'did-resolver'
import { getResolver as keyResolver } from 'key-did-resolver'

import { createIssuer, issueVC } from './issuer'
import { createHolderDID, verifyVC, generateIdentityFromVC } from './holder'
import { verifyProof, verifyVC as verifierVerifyVC } from './verifier'

async function main() {
  const resolver = new Resolver({ ...keyResolver() })
  const issuer = await createIssuer()

  // Liste des devices à simuler (serial + mac)
  const devices = [
    { serial: 'SN-000000001', mac: 'AA:BB:CC:DD:EE:01' },
    { serial: 'SN-000000002', mac: 'AA:BB:CC:DD:EE:02' },
    { serial: 'SN-000000003', mac: 'AA:BB:CC:DD:EE:03' },
  ]

  for (const deviceInfo of devices) {
    console.log(`\n➡️ Simulation holder pour device serial=${deviceInfo.serial}`)

    // 1. Création DID holder
    const holderDidInstance = await createHolderDID()
    const holderDid = holderDidInstance.id
    console.log('Holder DID:', holderDid)

    // 2. Issuer émet VC pour ce holder
    const vcJwt = await issueVC(issuer, holderDid, deviceInfo)
    console.log('VC JWT:', vcJwt)

    // 3. Holder vérifie VC
    const holderVerifiedVC = await verifyVC(vcJwt, resolver)
    console.log('VC vérifié côté Holder:', holderVerifiedVC)

    // 4. Holder génère identité Semaphore
    const identity = generateIdentityFromVC(holderVerifiedVC)
    console.log('Identité Semaphore générée:', identity)

    // (Optionnel) Verifier vérifie VC
    const verifierVCValid = await verifierVerifyVC(vcJwt, resolver)
    console.log('VC validé côté Verifier:', verifierVCValid)
  }

  console.log('\n✅ Simulation multi-holder terminée.')
}

main().catch(console.error)
*/

/*
***** simulation holder issuer verifier sans semaphore mais avec enregistrement 
      de vc et diddocument et de identity generer dans  un fichier json *****
*/

/*
import { Resolver } from 'did-resolver'
import { getResolver as keyResolver } from 'key-did-resolver'
import { verifyJWT, decodeJWT } from 'did-jwt'

// Fonctions personnalisées
import { createIssuer, issueAndSaveVC } from './issuer'
import { createHolderDID, loadVC, verifyVC, generateIdentityFromVC } from './holder'
import { verifyVC as verifierVerifyVC } from './verifier'

async function main() {
  console.log('➡️ 1. Création du Resolver DID')
  const resolver = new Resolver({
    ...keyResolver()
  })
  console.log('✅ Resolver DID prêt\n')

  console.log('➡️ 2. Création de l\'Issuer')
  const issuer = await createIssuer()
  console.log(`✅ Issuer DID: ${issuer.did}\n`)

  console.log('➡️ 3. Création du Holder DID (device)')
  const holderDidInstance = await createHolderDID()
  const holderDid = holderDidInstance.did
  console.log(`✅ Holder DID: ${holderDid}\n`)

  console.log('➡️ 4. Préparation des informations device')
  const deviceInfo = {
    serial: 'SN-000123456789',
    mac: 'AA:BB:CC:DD:EE:FF'
  }
  console.log('ℹ️ Device info:', deviceInfo, '\n')

  console.log('➡️ 5. Émission et sauvegarde du VC (Verifiable Credential)')
  const vcJwt = await issueAndSaveVC(issuer, holderDid, deviceInfo)
  console.log('✅ VC JWT émis et sauvegardé dans un fichier\n')

  console.log('➡️ 6. Chargement et vérification du VC côté Holder')
  const storedVcJwt = await loadVC(deviceInfo.serial)
  const holderVerifiedVC = await verifyVC(storedVcJwt, resolver)
  console.log('✅ VC vérifié côté Holder:\n', holderVerifiedVC, '\n')


  console.log('➡️ 7. Génération de l’identité Semaphore à partir du VC')
  const { identity, commitment } = generateIdentityFromVC(holderVerifiedVC)

  console.log('✅ Identité Semaphore générée:')
  console.log('🆔 Identity:', identity)
  console.log('📎 Commitment:', commitment.toString(), '\n')



  console.log('➡️ 8. Vérification du VC côté Verifier')
  const verifierVCValid = await verifierVerifyVC(vcJwt, resolver)
  console.log('✅ VC validé côté Verifier:', verifierVCValid, '\n')

  console.log('➡️ 9. Résolution et affichage du DID Document du Holder')
  const resolved = await resolver.resolve(holderDid)
  console.log('✅ DID Document du Holder:\n', JSON.stringify(resolved.didDocument, null, 2), '\n')

  // (Optionnel) Étape Semaphore Proof une fois implémentée
  // console.log('➡️ 10. Vérification de la preuve Semaphore')
  // const proofValid = await verifyProof(identity.semaphoreProof)
  // console.log('✅ Preuve Semaphore validée:', proofValid, '\n')

  console.log('🎉 Workflow SSI + Semaphore terminé avec succès !')
}

main().catch(err => {
  console.error('❌ Erreur dans le workflow SSI:', err)
})

*/
/*
import { Resolver } from 'did-resolver'
import { getResolver as keyResolver } from 'key-did-resolver'

// Fonctions personnalisées
import { createIssuer, issueAndSaveVC } from './issuer'
import { createHolderDID, loadVC, verifyVC, generateIdentityFromVC } from './holder'
import { verifyVC as verifierVerifyVC } from './verifier'



async function processDevice(deviceInfo: { serial: string; mac: string }, issuer: any, resolver: any) {
  console.log(`➡️ Traitement du device ${deviceInfo.serial}`)

  // 1. Création Holder DID
  const holderDidInstance = await createHolderDID()
  const holderDid = holderDidInstance.did

  // 2. Émission VC
  const vcJwt = await issueAndSaveVC(issuer, holderDid, deviceInfo)

  // 3. Chargement + Vérification VC
  const storedVcJwt = await loadVC(deviceInfo.serial)
  const holderVerifiedVC = await verifyVC(storedVcJwt, resolver)

  // 4. Génération identité Semaphore
  const { identity, commitment } = generateIdentityFromVC(holderVerifiedVC)

  // 5. Vérification VC côté Verifier
  const verifierVCValid = await verifierVerifyVC(vcJwt, resolver)

  console.log(`✅ Device ${deviceInfo.serial} traité.`)
  return { deviceInfo, holderDid, identity, commitment, verifierVCValid }
}

async function main() {
  const resolver = new Resolver({ ...keyResolver() })
  const issuer = await createIssuer()

  const devicesInfo = [
    { serial: 'SN-000123456789', mac: 'AA:BB:CC:DD:EE:FF' },
    { serial: 'SN-000987654321', mac: '11:22:33:44:55:66' },
    // autres devices...
  ]

  // Traitement parallèle (toutes les promesses lancées d’un coup)
  const results = await Promise.all(
    devicesInfo.map(deviceInfo => processDevice(deviceInfo, issuer, resolver))
  )

  console.log('🎉 Tous les devices ont été traités :', results)
}

main().catch(console.error)

*/
