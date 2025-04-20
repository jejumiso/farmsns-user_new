// src/utils/watchCompanyRealtime.ts

import { onSnapshot, doc } from 'firebase/firestore'
import { COLLECTION_PERMISSIONS } from '~/shared-constants/collections'
import { versionWatchers, type VersionKey } from '@/constants/versionWatchers'
import { loadVersionCache, saveVersionCache } from '@/utils/cache/versionCache'
import { useNuxtApp } from '#app' // 👈 이거 추가
let unsubscribeCompany: (() => void) | null = null

export function stopCompanyRealtimeWatcher() {
  if (unsubscribeCompany) {
    unsubscribeCompany()
    unsubscribeCompany = null
  }
}

export function watchCompanyRealtime(companyId: string) {
    // ✅ 이전 구독 해제
    if (unsubscribeCompany) {
      unsubscribeCompany()
      unsubscribeCompany = null
    }
    const { $firebaseDb } = useNuxtApp()
  const companyDocRef = doc(
    $firebaseDb,
    COLLECTION_PERMISSIONS.company.name,
    companyId
  )

  let prevVersions = loadVersionCache(companyId)
  console.log('🔍 이전 버전:', prevVersions)


  unsubscribeCompany = onSnapshot(companyDocRef, async (snapshot) => {
    console.log('🔄 회사 정보 변경 감지')
    if (!snapshot.exists()) return

    const company = snapshot.data()

    for (const key of Object.keys(versionWatchers) as VersionKey[]) {
      const watcher = versionWatchers[key]
      const newVersion = company[key]
      const oldVersion = prevVersions[key]

      if (typeof newVersion === 'number' && typeof oldVersion === 'number' && newVersion !== oldVersion) {
        const majorNew = Math.floor(newVersion)
        const majorOld = Math.floor(oldVersion)

        if (majorNew !== majorOld) {
          console.log(`🔁 ${watcher.label} 스키마 변경 감지 → 전체 초기화`)
          await (watcher.store() as any).syncFromScratch?.(company.id)

        } else {
          console.log(`🔄 ${watcher.label} 단순 변경 감지 → 변경 항목만 동기화`)
          await (watcher.store() as any).syncWithServer?.(company.id)
        }

        prevVersions[key] = newVersion
        saveVersionCache(companyId, { [key]: newVersion })
      }
    }
  })
}
