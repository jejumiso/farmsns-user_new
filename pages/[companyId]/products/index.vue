// 📁 pages/[companyId]/products/index.vue
<template>
  <div class="p-4 max-w-3xl mx-auto">
    <!-- 카테고리 버튼 -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="viewStore.setCategory(cat.id)"
        :class="[
          'px-3 py-1 border rounded-full text-sm',
          viewStore.selectedCategoryId === cat.id
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        ]"
      >
        {{ cat.categoryName }}
      </button>
    </div>

    <div v-if="filteredProducts.length === 0" class="text-gray-400 text-center">
      상품이 없습니다.
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="flex flex-col items-center"
      >
        <NuxtLink
          :to="`/${companyId}/products/${product.id}`"
          class="flex flex-col items-center"
        >
          <img
            :src="getImageUrl(product.imageThumbnailFileName)"
            class="w-full aspect-square object-cover rounded"
            alt="product"
          />
          <div class="mt-2 text-sm text-center">{{ product.productName }}</div>
          <div class="mt-1 text-green-700 font-semibold text-center">
            {{ product.priceDiscounted?.toLocaleString?.() + ' 원' || '가격 미정' }}
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- 🛒 하단 장바구니 버튼 -->
    <NuxtLink
      :to="`/${companyId}/cart`"
      class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50"
    >
      <span v-if="cartCount > 0">🛒 장바구니에 {{ cartCount }}개 담김 - 바로가기</span>
      <span v-else>🛒 장바구니가 비어있어요</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, watch, computed, nextTick } from 'vue'
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import { useProductListViewStore } from '@/stores/view/products/useListViewStore'
import { useCartStore } from '@/stores/cart/useCartStore'
import { STORAGE_BASE_URL } from '@/shared-constants/constants'

const getImageUrl = (fileName?: string) =>
  fileName?.trim() ? `${STORAGE_BASE_URL}/${fileName}` : '/assets/imgs/no-image.png'

const route = useRoute()
const companyId = route.params.companyId as string

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const viewStore = useProductListViewStore()
const cartStore = useCartStore()
const cartCount = computed(() => cartStore.totalQuantity)

const categories = computed(() =>
  [...categoryStore.items].sort((a, b) => a.displayLevel - b.displayLevel)
)

const filteredProducts = computed(() => {
  const selected = viewStore.selectedCategoryId
  const items = !selected
  ? productStore.items.filter(p => p.isVisible && p.stockQuantity > 0)
  : productStore.items
      .filter(p => Array.isArray(p.categories) && p.categories.includes(selected))
      .filter(p => p.isVisible && p.stockQuantity > 0)


  return items.slice().sort((a, b) => a.displayLevel - b.displayLevel)
})

onMounted(async () => {
  categoryStore.restoreCache(companyId)
  await categoryStore.syncWithServer(companyId)

  viewStore.loadFromCache()

  const hasValid = categoryStore.items.some(cat => cat.id === viewStore.selectedCategoryId)
  if (!hasValid) {
    const first = categories.value[0]
    viewStore.setCategory(first ? first.id : null)
  }

  productStore.restoreCache(companyId)
  await productStore.syncWithServer(companyId)

  await nextTick()
  const y = viewStore.scrollTop
  const maxScroll = document.body.scrollHeight - window.innerHeight
  if (y > 0 && y < maxScroll) {
    window.scrollTo({ top: y, behavior: 'auto' })
  }
})

window.addEventListener('scroll', () => {
  viewStore.setScrollTop(window.scrollY)
})
</script>
