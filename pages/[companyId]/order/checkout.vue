<template>
  <div class="p-6 max-w-md mx-auto space-y-4">
    <header class="flex justify-between p-4 border-b shadow-sm bg-white sticky top-0 z-50">
      <h1 class="font-bold text-lg">주문하기</h1>
      <button @click="close" class="text-gray-500 text-xl leading-none">×</button>
    </header>

    <div class="flex-1 overflow-y-auto p-4 space-y-6">

      <!-- 🛒 장바구니 요약 -->
      <div class="bg-gray-50 p-4 rounded-md">
        <h2 class="font-semibold text-lg mb-4">🛒 주문 요약</h2>
        <div v-for="item in cartItems" :key="item.id" class="flex justify-between border-b py-2 text-sm">
          <div>
            <p>{{ item.productName }}</p>
            <p v-if="item.options.length" class="text-xs text-gray-500">
              {{ item.options.map(opt => opt.selectedValue).join(', ') }}
            </p>
          </div>
          <div class="text-right">
            <p>{{ item.quantity }}개</p>
            <p>{{ (item.priceDiscounted * item.quantity).toLocaleString() }}원</p>
          </div>
        </div>
        <div class="text-right mt-4 text-sm">
          <p>총 상품금액: {{ cartTotal.toLocaleString() }}원</p>
          <p>쿠폰 할인: -{{ couponDiscount.toLocaleString() }}원</p>
          <p>포인트 사용: -{{ usedPoint.toLocaleString() }}원</p>

          <div class="mt-3 text-green-700">
            <p>🎁 적립 예정 포인트: {{ rewardPointPlanned }}P</p>
            <p>🎟️ 적립 예정 스탬프: {{ rewardStampPlanned }}개</p>
          </div>

          <div v-if="cartStore.items.some(item => item.rewardExcludedQuantity > 0)" class="mt-2 text-red-500 text-xs">
            ※ 일부 상품은 할인 적용으로 리워드가 제외됩니다.
          </div>

          <hr class="my-2" />
          <p class="text-lg font-bold">최종 결제금액: {{ finalAmount.toLocaleString() }}원</p>
        </div>

      </div>

      <!-- 🎟️ 쿠폰 선택 -->
      <div>
        <p class="font-medium">쿠폰 선택</p>
        <div v-for="coupon in coupons" :key="coupon.id" class="flex items-center gap-2">
          <input
            type="checkbox"
            :value="coupon.id"
            :checked="selectedCouponIds.includes(coupon.id)"
            @change="toggleCoupon(coupon.id)"
            :disabled="!usableCouponIds.includes(coupon.id)"
          />
          <label>{{ coupon.couponName }}</label>
        </div>
      </div>

      <!-- 💳 포인트 사용 -->
      <div>
        <p class="font-medium">포인트 사용</p>
        <div class="flex items-center gap-2 mt-1">
          <input
            type="number"
            v-model.number="usedPoint"
            class="border px-3 py-2 flex-1 rounded-md"
            :max="availablePoint"
            :min="0"
            @input="handlePointInput"
            :readonly="useMaxPoint"
          />
          <div class="flex flex-col text-xs text-gray-500">
            <p>보유: {{ availablePoint.toLocaleString() }}P</p>
            <label class="flex items-center gap-1 mt-1">
              <input type="checkbox" v-model="useMaxPoint" />
              최대 사용
            </label>
          </div>
        </div>
      </div>



      <!-- 🏦 결제 수단 -->
      <div>
        <p class="font-medium">결제 수단</p>
        <div class="flex gap-3 flex-wrap">
          <label v-for="method in paymentMethods" :key="method.value" class="flex items-center gap-2">
            <input type="radio" v-model="paymentMethod" :value="method.value" />
            {{ method.label }}
          </label>
        </div>
      </div>

      <button @click="placeOrder" class="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 mt-4">
        주문하기{{ optimizer.calculateSubtotalWithCoupons() }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart/useCartStore'
import { useCouponStore } from '@/stores/coupon/useCouponStore'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import { useOrderViewStore } from '@/stores/view/order/useOrderViewStore'
import { useCouponOptimizer } from '~/composables/coupon/useCouponOptimizer'
import type { IssuedCoupon } from '~/shared-types/coupon/issuedCoupon'

const router = useRouter()
const cartStore = useCartStore()
const couponStore = useCouponStore()
const authStore = useUserAuthStore()
const viewStore = useOrderViewStore()
const optimizer = useCouponOptimizer()

const cartItems = computed(() => cartStore.items)
const cartTotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.priceDiscounted * item.quantity, 0))

const availablePoint = ref(10000)


const coupons = computed(() => couponStore.coupons)

const selectedCouponIds = computed(() => optimizer.selectedCouponIds)
const usableCouponIds = computed(() => optimizer.usableCouponIds)

const usedPoint = ref(viewStore.usedPoint)

const couponDiscount = computed(() => {
  const subtotalWithoutCoupons = cartTotal.value
  const subtotalWithCoupons = optimizer.calculateSubtotalWithCoupons()
  return subtotalWithoutCoupons - subtotalWithCoupons
})

const finalAmount = computed(() => {
  return Math.max(0, cartTotal.value - couponDiscount.value - usedPoint.value)
})

const paymentMethods = [
  { value: 'onsite', label: '현장 결제' },
  { value: 'card', label: '카드 결제' },
  { value: 'bank', label: '무통장 입금' },
  { value: 'naverpay', label: '네이버페이' },
  { value: 'kakaopay', label: '카카오페이' },
  { value: 'easy', label: '비밀번호 간편결제' },
] as const

const paymentMethod = ref(viewStore.paymentMethod)

function toggleCoupon(couponId: string) {
  optimizer.toggleCoupon(couponId)
}

function placeOrder() {
  alert('✅ 주문 완료 (데모입니다)')
}

function close() {
  router.back()
}

onMounted(() => {
  optimizer.availableCoupons = couponStore.coupons
})
// ✅ usedPoint 자동 조정
const useMaxPoint = ref(false)

watch(useMaxPoint, (checked) => {
  if (checked) {
    // 최대 사용 체크되면 결제금액이나 보유포인트 중 최소값 사용
    usedPoint.value = Math.min(availablePoint.value, finalAmount.value+usedPoint.value)
  }
})
watch([couponDiscount, usedPoint], () => {
  const amountAfterCoupon = Math.max(0, cartTotal.value - couponDiscount.value)
  if (usedPoint.value > amountAfterCoupon) {
    usedPoint.value = amountAfterCoupon
  }
})

function handlePointInput() {
  if (usedPoint.value > availablePoint.value) {
    usedPoint.value = availablePoint.value
  }
  if (usedPoint.value < 0) {
    usedPoint.value = 0
  }
}

// 적립 예정 포인트/스탬프 (리워드 제외 수량 고려)
const rewardPointPlanned = computed(() => 
  cartStore.items.reduce((sum, item) =>
    sum + (item.quantity - item.rewardExcludedQuantity) * item.rewardPoint, 0)
)

const rewardStampPlanned = computed(() =>
  cartStore.items.reduce((sum, item) =>
    sum + (item.quantity - item.rewardExcludedQuantity) * item.rewardStamp, 0)
)
</script>
