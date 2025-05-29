// src/utils/watchCompanyRealtime.ts

import { onSnapshot, doc } from 'firebase/firestore'
import { COLLECTION_PERMISSIONS } from '~/shared-constants/collections'
import { versionWatchers, type VersionKey } from '@/constants/versionWatchers'
import { loadVersionCache, saveVersionCache } from '@/utils/cache/versionCache'
import { useNuxtApp } from '#app'

let unsubscribeCompany: (() => void) | null = null
let lastCompanyId: string | null = null

export function stopCompanyRealtimeWatcher() {
  if (unsubscribeCompany) {
    unsubscribeCompany()
    unsubscribeCompany = null
    lastCompanyId = null
  }
}

export function watchCompanyRealtime(companyId: string) {
  if (!companyId) return

  if (companyId === lastCompanyId) {
    console.log('⚠️ 이미 동일 회사 구독 중:', companyId)
    return
  }

  stopCompanyRealtimeWatcher()
  lastCompanyId = companyId

  const { $firebaseDb } = useNuxtApp()
  const companyDocRef = doc(
    $firebaseDb,
    COLLECTION_PERMISSIONS.company.name,
    companyId
  )

  let prevVersions = loadVersionCache(companyId)
  console.log('🔍 버전 캐시 로드 완료:', prevVersions)

  unsubscribeCompany = onSnapshot(companyDocRef, async (snapshot) => {
    console.log('🔄 회사 정보 변경 감지')

    if (!snapshot.exists()) return
    const company = snapshot.data()

    for (const key of Object.keys(versionWatchers) as VersionKey[]) {
      const watcher = versionWatchers[key]
      const newVersion = company.versionInfo?.[key]
      const oldVersion = prevVersions[key]

      const validNew = typeof newVersion === 'number' && !isNaN(newVersion)
      const validOld = typeof oldVersion === 'number' && !isNaN(oldVersion)

      if (!validNew || !validOld) {
        console.warn(`⚠️ 버전 정보 유효하지 않음: ${key}, new: ${newVersion}, old: ${oldVersion}`)
        continue
      }

      if (newVersion === oldVersion) {
        console.log(`✅ ${watcher.label} 변경 없음 (${newVersion})`)
        continue
      }

      const majorNew = Math.floor(newVersion)
      const majorOld = Math.floor(oldVersion)

      try {
        if (majorNew !== majorOld) {
          console.log(`🆕 ${watcher.label} 스키마 변경 감지 → 전체 초기화: ${oldVersion} → ${newVersion}`)
          await (watcher.store() as any).syncFromScratch?.(companyId)
        } else {
          console.log(`🔄 ${watcher.label} 내용 변경 감지 → 일부 동기화: ${oldVersion} → ${newVersion}`)
          await (watcher.store() as any).syncWithServer?.(companyId)
        }

        // ✅ 성공한 경우에만 캐시 업데이트
        prevVersions[key] = newVersion
        saveVersionCache(companyId, { [key]: newVersion })
      } catch (err) {
        console.error(`❌ ${watcher.label} 동기화 실패:`, err)
      }
    }
  })
}
