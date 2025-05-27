<!-- 📁 pages/[companyId]/products/index.vue-->
<template>
  <div class="p-4 max-w-3xl mx-auto space-y-6 bg-white pb-0">

    <!-- 카테고리 필터 -->
    <div class="flex flex-wrap gap-2 justify-center">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="viewStore.setCategory(cat.id)"
        :class="[
          'px-4 py-1.5 text-sm font-medium rounded-full transition-all border shadow-sm',
          viewStore.selectedCategoryId === cat.id
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        ]"
      >
        {{ cat.categoryName }}
      </button>
    </div>
    <!-- 영업 상태 안내 -->
    <div
      class="rounded-lg px-4 py-3 text-sm text-center shadow-sm border font-medium"
      :class="companyStore.currentCompany?.isOpen
        ? 'bg-green-50 text-green-700 border-green-100'
        : 'bg-gray-100 text-gray-500 border-gray-200'"
      v-html="companyStore.currentCompany?.isOpen
        ? '✅ 영업중입니다. 많은 이용 부탁드립니다!'
        : getNextOpenMessage()"
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
const authStore = useUserAuthStore()
const companyStore = useCompanyStore()


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

function getNextOpenMessage(): string {
  const businessHours = companyStore.currentCompany?.businessHours
  if (!businessHours) return '영업 시간이 설정되지 않았습니다.'

  const now = new Date()
  const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
  type DayKey = typeof dayMap[number]

  const todayIndex = now.getDay()
  const todayKey = dayMap[todayIndex] as DayKey

  for (let i = 1; i <= 7; i++) {
    const nextIndex = (todayIndex + i) % 7
    const nextKey = dayMap[nextIndex] as DayKey
    const day = businessHours.weeklyHours[nextKey]

    if (day?.isOpen) {
      const h = String(day.openHour).padStart(2, '0')
      const m = String(day.openMinute).padStart(2, '0')
      const h2 = String(day.closeHour).padStart(2, '0')
      const m2 = String(day.closeMinute).padStart(2, '0')
      const label = i === 1 ? '내일' : `${['일', '월', '화', '수', '목', '금', '토'][nextIndex]}요일`
      return `⛔️ 영업 종료. <strong class="text-green-600">${label} ${h}시${m}분~${h2}시${m2}분</strong>에 다시 열어요 😊`.replaceAll('00분','')
      if(day.openMinute === 0 && day.closeMinute === 0){
        return `⛔️ 영업 종료. <strong class="text-green-600">${label} ${h}~${h2}시</strong>에 다시 열어요 😊`
      }else{
        return `⛔️ 영업 종료. <strong class="text-green-600">${label} ${h}시${m}분</strong>에 다시 열어요 😊`
      }
      
    }
  }

  return '⛔️ 현재 영업이 종료되었으며 예정된 오픈 시간이 없습니다.'
}



const isFakeMode = computed(() => {return authStore.customerProfile?.roles?.includes('fake') ?? false})
</script>
