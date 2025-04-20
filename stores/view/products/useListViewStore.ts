// 📁 stores/ui/productListViewStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLocalCache, setLocalCache } from '@/utils/cache/localCache'

const CACHE_KEY = 'productListViewState'

export const useProductListViewStore = defineStore('productListView', () => {
  const selectedCategoryId = ref<string | null>(null)
  const scrollTop = ref(0)

  // ✅ 캐시 로드
  function loadFromCache() {
    const cached = getLocalCache<{ selectedCategoryId: string | null; scrollTop: number }>(CACHE_KEY)
    if (cached) {
      selectedCategoryId.value = cached.selectedCategoryId
      scrollTop.value = cached.scrollTop
    }
  }

  // ✅ 캐시 저장
  function saveToCache() {
    setLocalCache(CACHE_KEY, {
      selectedCategoryId: selectedCategoryId.value,
      scrollTop: scrollTop.value
    })
  }

  function setCategory(id: string | null) {
    selectedCategoryId.value = id
    saveToCache()
  }

  function setScrollTop(y: number) {
    scrollTop.value = y
    saveToCache()
  }

  return {
    selectedCategoryId,
    scrollTop,
    setCategory,
    setScrollTop,
    loadFromCache
  }
})
