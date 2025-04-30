<!-- 📁 /pages/[companyId]/payment/complete.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6">
    <template v-if="isSuccess">
      <h1 class="text-2xl font-bold mb-4">✅ 결제가 완료되었습니다 🎉</h1>
      <p class="text-gray-600 mb-8">주문번호: {{ orderId }}</p>
    </template>

    <template v-else>
      <h1 class="text-2xl font-bold text-red-600 mb-4">❌ 결제에 실패했습니다</h1>
      <p class="text-gray-600 mb-8">문제가 발생했습니다. 다시 시도해주세요.</p>
    </template>

    <button @click="goToOrderList" class="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
      주문내역 보기
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart/useCartStore'
import { useUserAuthStore } from '~/stores/userAuth/useUserAuthStore'
import { useCouponStore } from '~/stores/coupon/useCouponStore'

const router = useRouter()
const route = useRoute()

const companyId = route.params.companyId as string
const orderId = route.query.orderId as string | undefined

const isSuccess = computed(() => !!orderId)

const cartStore = useCartStore()
const userAuthStore = useUserAuthStore()
const couponStore = useCouponStore()

onMounted(() => {
  if (!isSuccess.value) return

  const handledKey = `paymentHandled:${orderId}`

  if (sessionStorage.getItem(handledKey)) {
    // 이미 처리한 주문이면 자동 이동
    return
  }

  // ✅ 최초 진입 시에만 처리
  sessionStorage.setItem(handledKey, 'true')
  cartStore.clearCart()
  userAuthStore.syncCustomerProfile()
  userAuthStore.syncCustomerCompanyActivity()
  couponStore.fetchMyModifiedCoupons()
})

function goToOrderList() {
  router.push(`/${companyId}/orders`)
}
</script>
