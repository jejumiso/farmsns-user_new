// utils/companyCache.ts

import { isRef, toRaw } from "vue"

const CACHE_KEY_PREFIX = 'companyDataCache'

/**
 * 회사별 캐시 불러오기
 * @param type 캐시 타입 (예: 'product', 'category')
 * @param companyId 회사 ID
 * @returns T 타입의 캐시 객체
 */
export function getCompanyCache<T>(type: string, companyId: string): { data: T; updatedAt: number } | null {
  const key = `${CACHE_KEY_PREFIX}:${type}:${companyId}`
  const raw = localStorage.getItem(key)
  // console.log('restoreCache getCompanyCache', key, raw)

  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    return parsed as { data: T; updatedAt: number }
  } catch {
    console.warn(`⚠️ 캐시 파싱 실패: ${key}`)
    return null
  }
}



/**
 * 회사별 캐시 저장
 * @param type 캐시 타입
 * @param companyId 회사 ID
 * @param data 저장할 데이터 (T)
 */
export function setCompanyCache<T>(type: string, companyId: string, data: T) {
  const key = `${CACHE_KEY_PREFIX}:${type}:${companyId}`

  const rawData = isRef(data) ? toRaw(data.value) : toRaw(data)

  const wrapped = {
    data: rawData,
    updatedAt: Date.now(),
  }

  console.log('setCompanyCache', key, wrapped)
  // 캐시가 없으면 새로 저장

  try {
    localStorage.setItem(key, JSON.stringify(wrapped))
    console.log('✅ 캐시 저장 성공:', key)
  } catch (e) {
    console.warn('❌ 캐시 저장 실패:', key, e)
  }

}

/**
 * 회사별 캐시 초기화
 * @param type 캐시 타입
 * @param companyId 회사 ID
 */
export function clearCompanyCache(type: string, companyId: string) {
  const key = `${CACHE_KEY_PREFIX}:${type}:${companyId}`
  localStorage.removeItem(key)
}


/**
 * 모든 회사 캐시 초기화 (버전 포함)
 */
export function clearAllCompanyCaches() {
  const prefix = `${CACHE_KEY_PREFIX}:`

  // Object.keys(localStorage) 는 일부 브라우저에서 작동 안 할 수 있으므로 아래 방식 권장
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      localStorage.removeItem(key)
    }
  }
}



/**
 * 하루가 지난 캐시 삭제
 */
export function purgeExpiredCompanyCaches(ttlMs = 1000 * 60 * 60 * 24) {
  const prefix = `${CACHE_KEY_PREFIX}:`
  const now = Date.now()

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith(prefix)) continue

    const raw = localStorage.getItem(key)
    if (!raw) continue

    try {
      const parsed = JSON.parse(raw)
      if (typeof parsed.updatedAt === 'number' && now - parsed.updatedAt > ttlMs) {
        localStorage.removeItem(key)
        console.log(`🧹 캐시 만료됨 → 삭제됨: ${key}`)
      }
    } catch {
      // 잘못된 JSON은 삭제
      localStorage.removeItem(key)
      console.warn(`⚠️ 캐시 파싱 실패 → 삭제됨: ${key}`)
    }
  }
}
