// services/firebaseService.ts

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  appId: string
}

export function initializeFirebase(config: FirebaseConfig) {
  if (!firebaseApp) {
    if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
      throw new Error('❌ Firebase 환경 변수가 누락되었습니다.')
    }

    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(config)
    auth = getAuth(firebaseApp)
    db = getFirestore(firebaseApp)

    console.log('✅ Firebase 초기화 완료')
  }
}

export function getFirebaseAuth(): Auth {
  if (!auth) throw new Error('❌ Firebase Auth가 초기화되지 않았습니다.')
  return auth
}

export function getFirebaseDb(): Firestore {
  if (!db) throw new Error('❌ Firestore가 초기화되지 않았습니다.')
  return db
}
