// 📁 utils\cache\localCache.ts
const PREFIX = 'localCache:'

interface CacheEntry<T> {
  data: T
  updatedAt: number
}

export function setLocalCache<T>(key: string, value: T): void {
  const wrapped: CacheEntry<T> = {
    data: value,
    updatedAt: Date.now(),
  }
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(wrapped))
  } catch (e) {
    console.warn('❗로컬 캐시 저장 실패:', e)
  }
}

export function getLocalCache<T>(key: string, maxAgeMs?: number): T | null {
  const raw = localStorage.getItem(`${PREFIX}${key}`)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as CacheEntry<T>
    if (maxAgeMs && Date.now() - parsed.updatedAt > maxAgeMs) {
      removeLocalCache(key)
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

export function removeLocalCache(key: string) {
  localStorage.removeItem(`${PREFIX}${key}`)
}

export function clearAllLocalCaches() {
  for (const key in localStorage) {
    if (key.startsWith(PREFIX)) {
      localStorage.removeItem(key)
    }
  }
}
