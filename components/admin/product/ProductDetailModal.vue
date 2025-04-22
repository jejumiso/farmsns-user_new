
<script setup lang="ts">
// components/admin/product/ProductDetailModal.vue
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product/useProductStore'
import ProductOptions from './ProductOptions.vue'
import { getImageUrl } from '@/utils/getImageUrl'
import { useCartStore } from '@/stores/cart/useCartStore'
import type { Product } from '@/shared-types/product/product'
import type { Option } from '@/shared-types/option/option'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const productStore = useProductStore()
const optionStore = useOptionStore()
const optionGroupStore = useOptionGroupStore()

const productId = route.params.productId as string
const companyId = route.params.companyId as string
const product = computed(() => productStore.items.find(p => p.id === productId))

const selectedOptions = ref<Record<string, any>>({})
const quantity = ref(1)

const options = computed<Option[]>(() => {
  const p = product.value
  if (!p) return []

  if (p.optionGroupId) {
    const group = optionGroupStore.items.find(g => g.id === p.optionGroupId)
    return group ? optionStore.items.filter(o => group.optionIds.includes(o.id)) : []
  } else {
    return optionStore.items.filter(o => p.optionIds.includes(o.id))
  }
})

const closeModal = () => {
  document.body.style.overflow = ''
  router.back()
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

function addToCart() {
  if (!product.value || quantity.value <= 0) return

  const optionResults = options.value.flatMap((opt) => {
    const selected = selectedOptions.value[opt.id]
    if (opt.type === 'select') {
      return [ {
        optionId: opt.id,
        optionName: opt.optionName,
        selectedValue: opt.optionItems[selected],
        price: opt.optionItemsPrice[selected] || 0,
      }]
    } else if (opt.type === 'check') {
      return (selected || []).map((i: number) => ({
        optionId: opt.id,
        optionName: opt.optionName,
        selectedValue: opt.optionItems[i],
        price: opt.optionItemsPrice[i] || 0,
      }))
    } else if (opt.type === 'quantity' && selected > 0) {
      return [{
        optionId: opt.id,
        optionName: opt.optionName,
        selectedValue: `${opt.optionItems[0]} x ${selected}`,
        price: (opt.optionItemsPrice[0] || 0) * selected
      }]
    } else {
      return []
    }
  })

  cartStore.addToCartWithOptions(product.value, optionResults, quantity.value)
  // alert('장바구니에 담겼습니다!')
  closeModal()
}
</script>

<template>
  <div class="fixed inset-0 bg-white z-50 overflow-auto">
    <!-- 상단 닫기 버튼 -->
    <div class="flex justify-end p-4">
      <button @click="closeModal" class="text-gray-500 hover:text-black text-xl">✕</button>
    </div>
    <div class="p-4 max-w-md mx-auto space-y-6">
      <img
        :src="getImageUrl(product?.imageThumbnailFileName)"
        alt="상품 이미지"
        class="w-full aspect-square object-cover rounded shadow"
      />

      <h1 class="text-xl font-semibold text-center">{{ product?.productName }}</h1>
      <p class="text-green-600 text-lg text-center">{{ product?.priceDiscounted?.toLocaleString() + '원' }}</p>

      <!-- 옵션 선택 -->
      <ProductOptions
        v-if="product"
        :product="product"
        v-model:selectedOptions="selectedOptions"
        v-model:quantity="quantity"
      />
      <button
        class="w-full py-3 mt-6 bg-green-600 text-white rounded shadow hover:bg-green-700"
        @click="addToCart"
      >
        장바구니에 담기
      </button>
    </div>
  </div>
</template>
