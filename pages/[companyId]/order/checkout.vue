<template>
  <div class="min-h-screen flex flex-col bg-white">
    <header class="flex items-center justify-between px-4 py-3 border-b shadow-sm sticky top-0 bg-white z-50">
      <h1 class="text-base font-semibold">주문하기</h1>
      <button @click="close" class="text-gray-500 text-xl leading-none">×</button>
    </header>

    <div class="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto space-y-6">

      <!-- ✅ 장바구니 + 결제 요약 -->
      <div class="bg-gray-50 p-4 rounded-md mb-6">
        <h2 class="font-semibold text-lg mb-3">🛒 주문 요약</h2>

        <div v-for="item in cartItems" :key="item.id" class="flex justify-between py-2 border-b text-sm">
          <div>
            <p class="font-medium">{{ item.productName }}</p>
            <p v-if="item.options.length > 0" class="text-gray-500">
              {{ item.options.map(opt => opt.selectedValue).join(', ') }}
            </p>
          </div>
          <div class="text-right">
            <p>{{ item.quantity }}개</p>
            <p>{{ (item.priceDiscounted * item.quantity).toLocaleString() }}원</p>
          </div>
        </div>

        <div class="mt-4 text-right text-sm">
          <p>상품 총액: {{ subtotalAfterFreeItem.toLocaleString() }} 원</p>
          <p>쿠폰 할인: -{{ couponDiscount.toLocaleString() }} 원</p>
          <p>포인트 사용: -{{ usedPoint.toLocaleString() }} 원</p>
          <hr class="my-2" />
          <p class="text-lg font-bold">결제할 금액: {{ finalAmount.toLocaleString() }} 원</p>
        </div>
      </div>

      <!-- ✅ 주문 방식 -->
      <div class="flex gap-2 justify-center">
        <button
          v-for="method in methods"
          :key="method.value"
          @click="selectMethod(method.value)"
          :class="[
            'px-4 py-2 rounded-md',
            selectedMethod === method.value ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'
          ]"
        >
          {{ method.label }}
        </button>
      </div>

      <!-- ✅ 포인트 사용 -->
      <div>
        <p class="font-medium">포인트</p>
        <p>보유: {{ availablePoint.toLocaleString() }}P</p>
        <input
          type="number"
          v-model.number="usedPoint"
          class="border border-gray-300 px-3 py-2 w-full rounded-md mt-1"
          :max="availablePoint"
        />
      </div>

      <!-- ✅ 쿠폰 선택 -->
      <div>
        <p class="font-medium">쿠폰 선택</p>
        <div v-for="coupon in coupons" :key="coupon.id" class="flex items-center gap-2">
          <input
            type="checkbox"
            :value="coupon.id"
            v-model="selectedCouponIds"
            :disabled="!canUseCoupon(coupon)"
          />
          <label>
            {{ coupon.couponName }}
            <span v-if="!canUseCoupon(coupon)" class="text-red-500 text-sm">(사용 불가)</span>
          </label>
        </div>
      </div>

      <!-- ✅ 결제 수단 -->
      <div>
        <p class="font-medium">결제 수단</p>
        <div class="flex gap-3 flex-wrap">
          <label v-for="method in paymentMethods" :key="method.value" class="flex items-center gap-2 cursor-pointer">
            <input type="radio" :value="method.value" v-model="paymentMethod" />
            {{ method.label }}
          </label>
        </div>
      </div>

      <button @click="placeOrder" class="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
        주문하기
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart/useCartStore'
import { useCouponStore } from '@/stores/coupon/useCouponStore'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import { useOrderViewStore } from '@/stores/view/order/useOrderViewStore'

const router = useRouter()
const cartStore = useCartStore()
const couponStore = useCouponStore()
const authStore = useUserAuthStore()
const viewStore = useOrderViewStore()

const cartItems = computed(() => cartStore.items)

const selectedMethod = ref(viewStore.selectedMethod)
const usedPoint = ref(viewStore.usedPoint)
const paymentMethod = ref(viewStore.paymentMethod as 'onsite' | 'card' | 'bank')

const methods = [
  { value: 'takeout', label: '포장' },
  { value: 'dinein', label: '매장' },
  { value: 'delivery', label: '배달' },
] as const

const paymentMethods = [
  { value: 'onsite', label: '현장 결제' },
  { value: 'card', label: '카드 결제' },
  { value: 'bank', label: '무통장 입금' },
] as const

function selectMethod(method: typeof methods[number]['value']) {
  selectedMethod.value = method
}

const availablePoint = authStore.customerCompanyActivity?.pointRemaining ?? 0
const coupons = computed(() => couponStore.coupons)
const selectedCouponIds = ref<string[]>([])

const appliedCoupons = computed(() => coupons.value.filter(c => selectedCouponIds.value.includes(c.id)))
const applicableFreeItemProductIds = computed(() => appliedCoupons.value
  .filter(c => c.type === 'freeItem')
  .flatMap(c => c.availableProductIds ?? []))

const cartItemsAfterFreeItem = computed(() => cartItems.value.map(item => {
  if (applicableFreeItemProductIds.value.includes(item.productId)) {
    return { ...item, priceDiscounted: 0 }
  }
  return item
}))

const subtotalAfterFreeItem = computed(() => cartItemsAfterFreeItem.value.reduce((sum, item) => sum + item.priceDiscounted * item.quantity, 0))

const percentCoupons = computed(() => appliedCoupons.value.filter(c => c.type === 'percentDiscount'))
const fixedCoupons = computed(() => appliedCoupons.value.filter(c => c.type === 'fixedAmountDiscount'))

const couponDiscount = computed(() => {
  let subtotal = subtotalAfterFreeItem.value
  let discount = 0

  for (const coupon of percentCoupons.value) {
    if (coupon.availableProductIds && coupon.availableProductIds.length > 0) {
      const eligibleItems = cartItemsAfterFreeItem.value.filter(item => coupon.availableProductIds?.includes(item.productId))
      const eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + item.priceDiscounted * item.quantity, 0)
      discount += Math.floor(eligibleSubtotal * (coupon.discountRate / 100))
    } else {
      discount += Math.floor(subtotal * (coupon.discountRate / 100))
    }
  }

  for (const coupon of fixedCoupons.value) {
    discount += coupon.discountAmount
  }

  return Math.min(discount, subtotal)
})

const finalAmount = computed(() => {
  const used = usedPoint.value
  const subtotal = subtotalAfterFreeItem.value
  const discount = couponDiscount.value
  const afterCoupon = Math.max(0, subtotal - discount)
  return Math.max(0, afterCoupon - used)
})

function canUseCoupon(coupon: any) {
  // freeItem 쿠폰: 장바구니에 적용 상품이 있어야 가능
  if (coupon.type === 'freeItem') {
    return cartItems.value.some(item => coupon.availableProductIds?.includes(item.productId))
  }

  // percentDiscount, fixedAmountDiscount 쿠폰
  if (coupon.type === 'percentDiscount' || coupon.type === 'fixedAmountDiscount') {
    const availableProducts = coupon.availableProductIds ?? []

    if (availableProducts.length === 0) {
      // 모든 상품에 적용 가능
      return true
    }

    // 특정 상품만 적용 가능
    const hasEligibleProduct = cartItems.value.some(item =>
      availableProducts.includes(item.productId)
    )

    if (coupon.type === 'percentDiscount') {
      // 퍼센트 할인은 1장만 허용
      const alreadySelectedPercent = appliedCoupons.value.some(c => c.type === 'percentDiscount')
      return (!alreadySelectedPercent || selectedCouponIds.value.includes(coupon.id)) && hasEligibleProduct
    }

    return hasEligibleProduct
  }

  return true // 기본값
}



function placeOrder() {
  alert('✅ 주문 완료 (데모입니다)')
}

function close() {
  router.back()
}

onMounted(() => {
  if (viewStore.scrollTop) {
    window.scrollTo({ top: viewStore.scrollTop, behavior: 'auto' })
  }
})

window.addEventListener('scroll', () => {
  viewStore.scrollTop = window.scrollY
})
</script>
