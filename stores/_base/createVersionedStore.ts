import { defineStore } from 'pinia'
import type { ApiResponse } from '@/shared-types/apiResponse'
import { getCompanyCache, setCompanyCache } from '@/utils/cache/companyCache'
import { ref } from 'vue'

interface CreateVersionedStoreOptions<T extends { id: string }> {
  storeId: string
  cacheKey: string
  getDataModified: (companyId: string, since: number) => Promise<ApiResponse<T[]>>
  getDataDeleted: (companyId: string) => Promise<ApiResponse<string[]>>
  saveItem?: (companyId: string, item: T) => Promise<ApiResponse<{ id: string }>>
  saveItems?: (companyId: string, items: T[]) => Promise<ApiResponse>
  deleteItem?: (companyId: string, id: string) => Promise<ApiResponse>
}

export function createVersionedStore<T extends { id: string }>(options: CreateVersionedStoreOptions<T>) {
  return defineStore(options.storeId, () => {
    const items = ref<T[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const itemCount = () => items.value.length
    const allItems = () => items.value

    function restoreCache(companyId: string): void {
      if (!companyId?.trim()) return
      const cached = getCompanyCache<T[]>(options.cacheKey, companyId)

      if (cached?.data) {
        items.value = [...cached.data]
      }
    }

    async function syncFromScratch(companyId: string): Promise<ApiResponse> {
      items.value = []
      return await syncWithServer(companyId, true)
    }

    async function syncWithServer(companyId: string, forceFull = false): Promise<ApiResponse> {
      
      loading.value = true

      const cached = getCompanyCache<T[]>(options.cacheKey, companyId)

      const lastFetched = cached?.updatedAt ?? 0

      const now = Date.now()
      const maxCacheAge = 1000 * 60 * 60 * 1 // 1000 * 60 * 1 * 1 = 1분  1000 * 60 * 60 * 12 = 12시간
      const since = forceFull || now - lastFetched > maxCacheAge ? 0 : lastFetched

      // ✅ 캐시가 있고 전체 요청이 아닌 경우 → 먼저 복원
      // ✅ 캐시에서 아이템 복원 (전체 요청이 아니면)
      if (cached?.data && since > 0) {
        items.value = [...cached.data]
      }

      const resDeleted = await options.getDataDeleted(companyId)
      if (!resDeleted.isSuccess) {
        error.value = resDeleted.message || '불러오기 실패'
        return { isSuccess: false, message: error.value }
      }

      const resModified = await options.getDataModified(companyId, since)
      if (!resModified.isSuccess) {
        error.value = resModified.message || '불러오기 실패'
        return { isSuccess: false, message: error.value }
      }

      const updatedItems = resModified.data ?? []
      const filtered = items.value.filter(i => !resDeleted.data?.includes(i.id))
      const merged = [
        ...filtered.filter(i => !updatedItems.some(u => u.id === i.id)),
        ...updatedItems,
      ]

      items.value = [...merged] as T[]
      error.value = null

      if (resModified.isSuccess) {
        console.log(`syncWithServer ::  동기화 완료: ${items.value.length}개의 항목이 업데이트되었습니다.`)
        setCompanyCache<T[]>(options.cacheKey, companyId, items.value as T[])
      }

      loading.value = false
      return { isSuccess: true, data: items.value }
    }


    async function saveItem(companyId: string, item: T): Promise<ApiResponse<{ id: string }>> {
      if (!options.saveItem) throw new Error('saveItem 함수가 주입되지 않았습니다.')
      if (!companyId?.trim()) return { isSuccess: false, message: '회사 정보 없음' }

      const res = await options.saveItem(companyId, item)
      if (!res.isSuccess || !res.data?.id) return res

      const { id } = res.data
      const updated = items.value.filter(p => p.id !== id)
      updated.push({ ...item, id } as any)
      items.value = [...updated]

      return res
    }

    async function saveItems(companyId: string, itemList: T[]): Promise<ApiResponse> {
      if (!options.saveItems) throw new Error('saveItems 함수가 주입되지 않았습니다.')
      if (!companyId?.trim()) return { isSuccess: false, message: '회사 정보 없음' }

      const res = await options.saveItems(companyId, itemList)
      if (res.isSuccess) {
        const updated = [...items.value]
        for (const item of itemList) {
          const index = updated.findIndex(p => p.id === item.id)
          if (index !== -1) updated[index] = item as any
          else updated.push(item as any)
        }
        items.value = [...updated]
      }

      return res
    }

    async function deleteItem(companyId: string, id: string): Promise<ApiResponse> {
      if (!options.deleteItem) throw new Error('deleteItem 함수가 주입되지 않았습니다.')

      const res = await options.deleteItem(companyId, id)
      if (res.isSuccess) {
        items.value = items.value.filter(p => p.id !== id)
      }

      return res
    }

    return {
      items,
      loading,
      error,
      itemCount,
      allItems,
      restoreCache,
      syncFromScratch,
      syncWithServer,
      saveItem,
      saveItems,
      deleteItem,
    }
  })
}
