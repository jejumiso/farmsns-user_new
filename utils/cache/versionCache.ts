// 📁 src/utils/cache/versionCache.ts

/*!SECTION
  설명 : 상품,카데고리,옵션등을 캐싱하는 유틸리티

  앱을 켜면 0부터 시작해서
  무조건 1회 이상은 호출되는 함수들로 구성되어 있습니다.
  주의사항은 버전이 0부터 시작하므로
  company의 각 버전이 1부터 시작하는 것을 가정하고 있습니다.

*/

import {
  getCompanyCache,
  setCompanyCache,
  clearCompanyCache,
} from '@/utils/cache/companyCache'

import type { VersionKey } from '@/constants/versionWatchers'
import { versionKeys } from '@/constants/versionWatchers'

/**
 * 버전 캐시 타입 정의
 */
export type SingleVersionCache = {
  [K in VersionKey]: number
}

/**
 * 기본 버전 값
 */
function getDefaultCache(): SingleVersionCache {
  const defaultCache = {} as SingleVersionCache
  for (const key of versionKeys) {
    defaultCache[key] = 0
  }
  return defaultCache
}

const CACHE_TYPE = 'version'

/**
 * 버전 캐시 불러오기
 */
export function loadVersionCache(companyId: string): SingleVersionCache {
  const wrapped = getCompanyCache<SingleVersionCache>(CACHE_TYPE, companyId)

  return wrapped?.data ?? getDefaultCache()  // ✅ data 추출
}

/**
 * 버전 캐시 저장
 */
export function saveVersionCache(companyId: string, partial: Partial<SingleVersionCache>) {
  const prev = loadVersionCache(companyId)
  const merged = { ...prev, ...partial }

  setCompanyCache(CACHE_TYPE, companyId, merged)
}

/**
 * 버전 캐시 삭제
 */
export function clearVersionCache(companyId: string) {
  clearCompanyCache(CACHE_TYPE, companyId)
}
