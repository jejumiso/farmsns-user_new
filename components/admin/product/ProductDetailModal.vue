<template>
  <div class="fixed inset-0 bg-white z-50 overflow-auto">
    <!-- 상단 닫기 버튼 -->
    <div class="flex justify-end p-4">
      <button
        @click="closeModal"
        class="flex items-center gap-1 text-gray-600 hover:text-black text-sm"
        aria-label="닫기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>닫기</span>
      </button>
    </div>

    <div class="p-4 max-w-md mx-auto space-y-6">
      <!-- 상품 이미지 -->
      <img
        :src="getImageUrl(product?.imageThumbnailFileName)"
        alt="상품 이미지"
        class="w-full aspect-square object-cover rounded shadow-md"
      />

      <!-- 상품명/가격 -->
      <h1 class="text-xl font-bold text-center text-gray-800">{{ product?.productName }}</h1>
      <p class="text-center text-lg text-green-600 font-semibold">
        {{ product?.priceDiscounted?.toLocaleString() }}원
      </p>

      <!-- 옵션 선택 -->
      <ProductOptions
        v-if="product"
        :product="product"
        v-model:selectedOptions="selectedOptions"
        v-model:quantity="quantity"
      />

      <!-- 결제 요약 -->
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm text-gray-700 shadow-sm">
        <h2 class="text-base font-semibold text-gray-800 mb-2">🧾 결제 요약</h2>

        <div class="flex justify-between">
          <span>상품 단가</span>
          <span>{{ basePrice.toLocaleString() }}원</span>
        </div>

        <!-- 선택된 옵션 목록 -->
        <div v-if="selectedOptionSummaries.length" class="space-y-1">
          <div
            v-for="(opt, i) in selectedOptionSummaries"
            :key="i"
            class="flex justify-between text-xs text-gray-600"
          >
            <span>➕ {{ opt.name }}: {{ opt.value }}</span>
            <span>{{ opt.price.toLocaleString() }}원</span>
          </div>
        </div>

        <div class="flex justify-between">
          <span>수량</span>
          <span>{{ quantity }}개</span>
        </div>

        <!-- 리워드 정보 -->
        <div v-if="product?.rewardPoint > 0 || product?.rewardStamp > 0" class="text-xs text-blue-600 mt-1">
          <div v-if="product.rewardStamp > 0">🟠 스탬프 {{ product.rewardStamp * quantity }}개 적립</div>
          <div v-if="product.rewardPoint > 0">💎 포인트 {{ (product.rewardPoint * quantity).toLocaleString() }}P 적립</div>
        </div>

        <div class="border-t border-dashed pt-2 flex justify-between font-bold text-base text-green-700 mt-2">
          <span>총 결제 금액</span>
          <span>{{ totalPrice.toLocaleString() }}원</span>
        </div>
      </div>

      <!-- 버튼 영역 -->
      <button
        class="w-full py-3 mt-4 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition-all"
        @click="addToCart"
      >
        🛒 장바구니에 담기
      </button>
      <button
        class="w-full py-3 bg-gray-100 text-gray-700 rounded-xl shadow hover:bg-gray-200 transition-all"
        @click="closeModal"
      >
        ❌ 취소하고 돌아가기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product/useProductStore'
import { useCartStore } from '@/stores/cart/useCartStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'
import ProductOptions from './ProductOptions.vue'
import { getImageUrl } from '@/utils/getImageUrl'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()
const optionStore = useOptionStore()
const optionGroupStore = useOptionGroupStore()

const productId = route.params.productId as string
const companyId = route.params.companyId as string

const product = computed(() => productStore.items.find(p => p.id === productId)!)
const selectedOptions = ref<Record<string, any>>({})
const quantity = ref(1)

const options = computed(() => {
  const p = product.value
  if (!p) return []
  if (p.optionGroupId) {
    const group = optionGroupStore.items.find(g => g.id === p.optionGroupId)
    return group ? optionStore.items.filter(o => group.optionIds.includes(o.id)) : []
  } else {
    return optionStore.items.filter(o => p.optionIds.includes(o.id))
  }
})

const basePrice = computed(() => product.value?.priceDiscounted ?? 0)

const optionTotalPrice = computed(() => {
  return options.value.reduce((total, opt) => {
    const selected = selectedOptions.value[opt.id]
    if (opt.type === 'select' && selected != null) {
      return total + (opt.optionItemsPrice[selected] || 0)
    }
    if (opt.type === 'check' && Array.isArray(selected)) {
      return total + selected.reduce((sum, i) => sum + (opt.optionItemsPrice[i] || 0), 0)
    }
    if (opt.type === 'quantity' && selected > 0) {
      return total + ((opt.optionItemsPrice[0] || 0) * selected)
    }
    return total
  }, 0)
})

const totalPrice = computed(() => {
  return (basePrice.value + optionTotalPrice.value) * quantity.value
})

const selectedOptionSummaries = computed(() => {
  return options.value.flatMap(opt => {
    const selected = selectedOptions.value[opt.id]
    if (opt.type === 'select' && selected != null) {
      return [{
        name: opt.optionName,
        value: opt.optionItems[selected],
        price: opt.optionItemsPrice[selected] || 0
      }]
    }
    if (opt.type === 'check' && Array.isArray(selected)) {
      return selected.map((i: number) => ({
        name: opt.optionName,
        value: opt.optionItems[i],
        price: opt.optionItemsPrice[i] || 0
      }))
    }
    if (opt.type === 'quantity' && selected > 0) {
      return [{
        name: opt.optionName,
        value: `${opt.optionItems[0]} x ${selected}`,
        price: (opt.optionItemsPrice[0] || 0) * selected
      }]
    }
    return []
  })
})

function closeModal() {
  document.body.style.overflow = ''
  if (window.history.length <= 1) {
    router.replace(`/${companyId}/products`)
  } else {
    router.back()
  }
}

function addToCart() {
  if (!product.value || quantity.value <= 0) return

  const optionResults = selectedOptionSummaries.value.map(opt => ({
    optionId: '', // 저장 시 사용 안 하면 빈 문자열
    optionName: opt.name,
    selectedValue: opt.value,
    price: opt.price
  }))

  cartStore.addToCartWithOptions(product.value, optionResults, quantity.value)
  closeModal()
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
})
</script>
