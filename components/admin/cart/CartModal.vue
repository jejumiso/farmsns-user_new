<template>
    <div class="fixed inset-0 bg-white z-50 overflow-auto">
      <!-- 상단 닫기 버튼 -->
      <div class="flex justify-end p-4">
        <button @click="closeModal" class="text-gray-500 hover:text-black text-xl">✕</button>
      </div>
  
      <div class="p-4 max-w-md mx-auto space-y-6">
        <h2 class="text-xl font-bold text-center">🛒 장바구니</h2>
  
        <div v-if="cart.items.length === 0" class="text-center text-gray-400">
          장바구니가 비어있습니다.
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
                  - {{ opt.optionName }}: {{ opt.selectedValue }} <span v-if="opt.price > 0">(+{{ opt.price.toLocaleString() }}원)</span>
                </p>
                <div class="mt-2 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <button @click="decrease(index)" class="w-7 h-7 rounded bg-gray-200 text-sm">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="increase(index)" class="w-7 h-7 rounded bg-gray-200 text-sm">+</button>
                  </div>
                  <button @click="remove(index)" class="text-red-500 text-sm">삭제</button>
                </div>
              </div>
            </div>
          </div>
  
          <div class="text-right text-lg font-bold text-green-700 border-t pt-4">
            총 결제금액: ₩{{ cart.totalPrice.toLocaleString() }}
          </div>
  
          <button
            class="w-full py-3 bg-green-600 text-white rounded shadow hover:bg-green-700"
            @click="goToOrder"
          >
            주문하기
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
  router.push(`/${route.params.companyId}/orders/checkout`)
}

  </script>
  