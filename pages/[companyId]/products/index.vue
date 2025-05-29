<!-- 📁 pages/[companyId]/products/index.vue-->
<template>
  <div class="p-4 max-w-3xl mx-auto space-y-6 bg-white pb-0">

<!-- 카테고리 필터: 1줄 5개, 슬림하고 정렬된 버튼 -->
<div class="grid grid-cols-4 gap-2 max-w-5xl mx-auto mt-4">
  <button
    v-for="cat in categories"
    :key="cat.id"
    @click="viewStore.setCategory(cat.id)"
    class="text-sm font-medium text-center rounded-full border transition-all duration-150 cursor-pointer px-3 py-1.5 whitespace-nowrap"
    :class="viewStore.selectedCategoryId === cat.id
      ? 'bg-green-600 text-white border-green-600'
      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'"
  >
    {{ cat.categoryName }}
  </button>
</div>






    <!-- 영업 상태 안내 -->
    <div
      class="rounded-lg px-4 py-3 text-sm text-center shadow-sm border font-medium"
      :class="isOpen
        ? 'bg-green-50 text-green-700 border-green-100'
        : 'bg-gray-100 text-gray-500 border-gray-200'"
      v-html="openMessage"
    ></div>




    <!-- 상품 없음 안내 -->
    <div v-if="filteredProducts.length === 0" class="text-center text-gray-500 text-sm">
      상품이 없습니다 🥲
    </div>

    <!-- 상품 목록 3열 -->
    <div class="grid grid-cols-3 gap-4">
      <NuxtLink
        v-for="product in filteredProducts"
        :key="product.id"
        :to="`/${companyId}/products/${product.id}`"
        class="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col items-center"
      >
        <div class="w-full aspect-square">
          <img
            :src="getImageUrl(product.imageThumbnailFileName)"
            class="w-full h-full object-cover"
            alt="product"
          />
        </div>
        <div class="p-2 w-full text-center">
          <div class="text-xs font-semibold text-gray-800 truncate">
            {{ product.productName }}
          </div>
          <div class="text-xs font-bold text-green-600 mt-1">
            {{ product.priceDiscounted?.toLocaleString?.() + '원' || '가격 미정' }}
          </div>
        </div>
      </NuxtLink>
    </div>

<!-- 상품 목록 페이지 하단 장바구니 버튼 -->
<NuxtLink
  :to="`/${companyId}/cart`"
  :class="[
    'fixed left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-green-600 text-white text-sm font-medium px-6 py-3 rounded-full shadow-xl z-40 text-center',
    isFakeMode ? 'bottom-[230px]' : 'bottom-[65px]'
  ]"
>
  <span v-if="!companyStore.currentCompany?.isOpen">영업중이 아닙니다.</span>
  <span v-else-if="cartCount > 0">🛒 {{ cartCount }}개 담김 - 장바구니 보기</span>
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

import { useCompanyStore } from '@/stores/company/useCompanyStore'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import { getNextOpenMessage } from '@/utils/businessHours'


const authStore = useUserAuthStore()
const companyStore = useCompanyStore()
const currentCompany = computed(() => companyStore.currentCompany)
const isOpen = computed(() => currentCompany.value?.isOpen ?? false)

const openMessage = computed(() => {
  if (isOpen.value) {
    return '✅ 영업중입니다. 많은 이용 부탁드립니다!'
  }

  const businessHours = currentCompany.value?.businessHours
  return businessHours
    ? getNextOpenMessage(businessHours)
    : '⛔️ 영업 시간이 설정되지 않았습니다.'
})


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
  // categoryStore.restoreCache(companyId)
  // await categoryStore.syncWithServer(companyId)

  viewStore.loadFromCache()

  const hasValid = categoryStore.items.some(cat => cat.id === viewStore.selectedCategoryId)
  if (!hasValid) {
    const first = categories.value[0]
    viewStore.setCategory(first ? first.id : null)
  }

  // productStore.restoreCache(companyId)
  // await productStore.syncWithServer(companyId)

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




const isFakeMode = computed(() => {return authStore.customerProfile?.roles?.includes('fake') ?? false})
</script>
