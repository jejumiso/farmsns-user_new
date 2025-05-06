<template>
  <div class="fixed inset-0 bg-white z-50 overflow-auto">
    <!-- 상단 닫기 버튼 -->
    <div class="flex justify-end p-4">
      <button @click="closeModal" class="text-gray-500 hover:text-black text-xl">✕</button>
    </div>

    <div class="p-4 max-w-md mx-auto space-y-6">
      <h2 class="text-xl font-bold text-center">🛒 장바구니</h2>

      <div v-if="cart.items.length === 0" class="text-center text-gray-400">
        <p class="text-gray-500">장바구니가 비어있어요</p>
        <button @click="$emit('close')" class="px-4 py-2 bg-green-600 text-white rounded">
          상품 더 고르기
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(item, index) in cart.items"
          :key="index"
          class="border rounded p-3 shadow-sm"
        >
          <div class="flex items-center gap-3">
            <img
              :src="getImageUrl(item.image)"
              alt="상품 이미지"
              class="w-16 h-16 object-cover rounded"
            />
            <div class="flex-1">
              <p class="font-medium">{{ item.productName }}</p>
              <p v-for="opt in item.options" :key="opt.optionId" class="text-sm text-gray-500">
                - {{ opt.optionName }}: {{ opt.selectedValue }}
                <span v-if="opt.price > 0">(+{{ opt.price.toLocaleString() }}원)</span>
              </p>
              <div class="mt-2 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button @click="decrease(index)" class="w-7 h-7 rounded bg-gray-200 text-sm">-</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="increase(index)" class="w-7 h-7 rounded bg-gray-200 text-sm">+</button>
                </div>
                <button @click="remove(index)" class="text-red-500 text-sm">삭제</button>
              </div>

              <!-- ✅ 리워드 스탬프, 포인트 표시 -->
              <div class="mt-2 text-xs text-blue-600">
                <span v-if="item.rewardStamp > 0">🟠 구매 시 {{ item.rewardStamp }} 스탬프 제공</span>
                <span v-if="item.rewardPoint > 0" class="ml-2">💎 구매 시 {{ item.rewardPoint }} 포인트 제공</span>
              </div>
            </div>
          </div>
        </div>

        <div class="text-right text-sm text-gray-500 mt-4">
          정가 총액: ₩{{ cart.totalOriginalPrice.toLocaleString() }}
        </div>
        <div class="text-right text-lg font-bold text-green-700">
          결제 총액: ₩{{ cart.cartTotalWithOptions.toLocaleString() }}
        </div>

        <button
          class="w-full py-3 bg-green-600 text-white rounded shadow hover:bg-green-700"
          @click="goToOrder"
        >
          주문하기
        </button>
        <button
          class="w-full py-3 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300"
          @click="closeModal"
        >
          상품 더 고르기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart/useCartStore'
import { useRouter, useRoute } from 'vue-router'
import { getImageUrl } from '@/utils/getImageUrl'

const cart = useCartStore()
const router = useRouter()
const route = useRoute()

const closeModal = () => {
  document.body.style.overflow = ''
  router.back()
}

function increase(index: number) {
  const current = cart.items[index].quantity
  cart.updateQuantity(index, current + 1)
}

function decrease(index: number) {
  const current = cart.items[index].quantity
  if (current > 1) {
    cart.updateQuantity(index, current - 1)
  }
}

function remove(index: number) {
  cart.removeItemById(index)
}

function goToOrder() {
  document.body.style.overflow = ''
  router.push(`/${route.params.companyId}/order/checkout`)
}
</script>
