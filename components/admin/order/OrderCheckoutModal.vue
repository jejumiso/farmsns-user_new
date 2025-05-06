<template>
  <div class="fixed inset-0 bg-white z-50 overflow-auto">
    <!-- 상단 닫기 버튼 -->
    <div class="flex justify-between items-center p-4 border-b">
      <h2 class="text-lg font-semibold">🧾 주문하기</h2>
      <button @click="closeModal" class="text-gray-500 hover:text-black text-xl">✕</button>
    </div>

    <div class="p-4 max-w-md mx-auto space-y-6">
      <div v-if="items.length === 0" class="text-center text-gray-500">
        장바구니가 비어있습니다.
      </div>

      <div v-else>
        <!-- 주문 상품 목록 -->
        <div v-for="(item, index) in items" :key="index" class="border-b py-3">
          <div class="flex gap-3">
            <img
              :src="getImageUrl(item.image)"
              class="w-16 h-16 object-cover rounded"
              alt="상품 이미지"
            />
            <div class="flex-1">
              <p class="font-semibold">{{ item.productName }}</p>
              <p class="text-sm text-gray-600" v-for="opt in item.options" :key="opt.optionId">
                • {{ opt.optionName }}: {{ opt.selectedValue }}
              </p>
              <p class="text-sm text-gray-800 mt-1">
                ₩{{ item.priceDiscounted.toLocaleString() }} × {{ item.quantity }}
              </p>
            </div>
          </div>
        </div>

        <!-- 총액 -->
        <div class="mt-4 text-right space-y-1">
          <div class="text-sm text-gray-500">정가 총액: ₩{{ totalOriginalPrice.toLocaleString() }}</div>
          <div class="text-lg font-bold text-green-700">
            총 결제 금액: ₩{{ totalFinalPrice.toLocaleString() }}
          </div>
        </div>

        <!-- 주문하기 버튼 -->
        <button
          class="w-full py-3 mt-6 bg-green-600 text-white rounded shadow hover:bg-green-700"
          @click="placeOrder"
        >
          결제 진행하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart/useCartStore'
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/utils/getImageUrl'

const cartStore = useCartStore()
const items = cartStore.items
const totalFinalPrice = cartStore.cartTotalWithOptions
const totalOriginalPrice = cartStore.totalOriginalPrice

const router = useRouter()

const closeModal = () => {
  document.body.style.overflow = ''
  router.back()
}

function placeOrder() {
  alert('결제 처리를 진행합니다!')
  cartStore.clearCart()
  closeModal()
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
})
</script>
