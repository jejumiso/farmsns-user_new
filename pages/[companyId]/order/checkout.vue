<!-- 📁 pages/[companyId]/order/checkout.vue-->
<template>
  <div class="p-6 max-w-md mx-auto space-y-4">
    <header class="flex justify-between p-4 border-b shadow-sm bg-white sticky top-0 z-50">
      <h1 class="font-bold text-lg">주문하기</h1>
      <button @click="close" aria-label="닫기" class="text-gray-500 text-xl leading-none" type="button">&times;</button>
    </header>

    <div class="flex-1 overflow-y-auto p-4 space-y-6 min-h-screen pb-32">
      <div class="flex gap-2 justify-center">
        <button
          v-for="method in methods"
          :key="method.value"
          @click="selectMethod(method.value)"
          :class="[
            'px-4 py-2 rounded-md',
            selectedMethod === method.value ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'
          ]"
          type="button"
        >
          {{ method.label }}
        </button>
      </div>

      <div v-if="selectedMethod === 'delivery'" class="bg-gray-100 p-3 rounded-md">
        <p class="font-medium">배송지</p>
        <div v-if="selectedAddress">
          <p>{{ selectedAddress.label }} - {{ selectedAddress.address_name }}</p>
          <button @click="goToAddressManage" class="text-sm text-blue-500" type="button">
            배송지 변경 &gt;
          </button>
        </div>
        <div v-else>
          <p>배송지가 없습니다.</p>
          <button @click="goToAddressManage" class="text-sm text-blue-500" type="button">
            배송지 등록하기 &gt;
          </button>
        </div>
        <p v-if="distance !== null">
          📍 가계↔배송지 거리: <strong>{{ formattedDistance }}</strong>
        </p>
        <p v-else>거리 정보를 보내오는 중…</p>
      </div>

      <div class="bg-gray-50 p-4 rounded-md">
        <h2 class="font-semibold text-lg mb-4">🛍️ 주문 요약</h2>
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
          <p>채 상품금액: {{ cartTotal.toLocaleString() }}원</p>
          <p>쿠폰 할인: -{{ couponDiscount.toLocaleString() }}원</p>
          <p>포인트 사용: -{{ usedPointInput.toLocaleString() }}원</p>
          <div v-if="selectedMethod === 'delivery'">
            <p>배송비: {{ deliveryFee.toLocaleString() }}원</p>
          </div>
          <div class="mt-3 text-green-700">
            <p>🎁 적립 예정 포인트: {{ rewardPointPlanned }}P</p>
            <p>🎟️ 적립 예정 스탰프: {{ rewardStampPlanned }}개</p>
          </div>
          <div v-if="hasExcludedReward" class="mt-2 text-red-500 text-xs">
            ※ 일부 상품은 할인 적용으로 리워드가 제외됩니다.
          </div>
          <hr class="my-2" />
          <p class="text-lg font-bold">최종 결제금액: {{ finalAmount.toLocaleString() }}원</p>
        </div>
      </div>

      <div>
        <p class="font-medium">쿠폰 선택</p>
        <div v-for="coupon in filteredCoupons" :key="coupon.id" class="flex items-center gap-2">
          <input
            type="checkbox"
            :value="coupon"
            v-model="selectedCoupons"
            @change="toggleCoupon(coupon)"
            :disabled="!usableCoupons.includes(coupon)"
          />
          <label>{{ coupon.couponName }}</label>
        </div>
      </div>

      <div>
        <p class="font-medium">포인트 사용</p>
        <div class="flex items-center gap-2 mt-1">
          <input
            type="number"
            v-model.number="usedPointInput"
            class="border px-3 py-2 flex-1 rounded-md"
            :max="availablePoint"
            :min="0"
            :readonly="useMaxPoint"
            @blur="validateUsedPoint"
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

      <div v-if="finalAmount > 0">
        <p class="font-medium">결제 수단</p>
        <div class="space-y-2">
          <button
            v-for="method in paymentMethods"
            :key="method.value"
            @click="selectPaymentMethod(method.value)"
            type="button"
            :class="[
              'w-full py-3 px-4 rounded-md text-left border-2 transition font-medium',
              paymentMethod === method.value
                ? 'border-green-600 text-green-700 bg-green-50'
                : 'border-gray-300 text-gray-700 hover:border-gray-500'
            ]"
          >
            {{ method.label }}
          </button>
        </div>
      </div>

      <div class="sticky bottom-0 bg-white p-4 z-10">
        <button
  @click="placeOrder"
  :disabled="isPlacingOrder"
  class="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
  type="button"
>
  주문하기
</button>

      </div>

      <CardSliderModal
        v-if="showCardSlider"
        :order-id="tempOrderId"
        :amount="finalAmount"
        :client-id="companyStore.currentCompany?.nicepayConfig.clientId || ''"
        @close="showCardSlider = false"
      />
    </div>
  </div>
</template>



<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart/useCartStore'
import { useCouponStore } from '@/stores/coupon/useCouponStore'
import { useOrderSummaryStore } from '@/stores/order/useOrderSummaryStore'
import { useCompanyStore } from '@/stores/company/useCompanyStore'
import { useCouponOptimizer } from '~/composables/coupon/useCouponOptimizer'
import { useUserAuthStore } from '~/stores/userAuth/useUserAuthStore'
import { createOrderService } from '~/services/order/createOrderService'
import CardSliderModal from '@/components/payment/CardSliderModal.vue'
import type { IssuedCoupon } from '~/shared-types/coupon/issuedCoupon'
import { Timestamp } from '~/shared/firebase/firebaseTypes'
import type { Order } from '~/shared-types/order/order'
import { format } from 'date-fns'

declare global {
  interface Window {
    AUTHNICE: any;
  }
}

const methods = [
  { value: 'takeout', label: '포장' },
  { value: 'dinein', label: '매장' },
  { value: 'delivery', label: '배달' },
] as const

const paymentMethods = [
  { value: 'onsite', label: '현장 결제' },
  { value: 'bank', label: '입금(주문시 계좌 정보 있음)' },
  { value: 'card', label: '카드 결제' },
  { value: 'naverpayCard', label: '네이버페이' },
  { value: 'kakaopay', label: '카카오페이' },
  { value: 'easy', label: '비밀번호 간편결제' },
] as const

const router = useRouter()
const cartStore = useCartStore()
const couponStore = useCouponStore()
const orderSummaryStore = useOrderSummaryStore()
const companyStore = useCompanyStore()
const optimizer = useCouponOptimizer()
const userAuthStore = useUserAuthStore()

const tempOrderId = ref('')
const showCardSlider = ref(false)

const availablePoint = computed(() => userAuthStore.customerCompanyActivity?.pointRemaining ?? 0)
const coupons = computed(() => couponStore.coupons)
const companyId = companyStore.currentCompanyId

const filteredCoupons = computed(() => {
  if (!companyId) return []
  return coupons.value.filter(coupon =>
    coupon.issuingCompanyId === companyId || (coupon.availableCompanyIds?.includes(companyId))
  )
})

const couponDiscount = computed(() => optimizer.calculateCouponDiscountForSelected())
const useMaxPoint = ref(false)

watch(useMaxPoint, (newVal) => {
  if (newVal) recalculateUsedPoint()
})

const cartItems = computed(() => cartStore.items)
const cartTotal = computed(() => cartStore.cartTotal)
const rewardPointPlanned = computed(() =>
  cartItems.value.reduce((sum, item) => sum + (item.quantity - item.rewardExcludedQuantity) * item.rewardPoint, 0)
)
const rewardStampPlanned = computed(() =>
  cartItems.value.reduce((sum, item) => sum + (item.quantity - item.rewardExcludedQuantity) * item.rewardStamp, 0)
)
const hasExcludedReward = computed(() =>
  cartItems.value.some(item => item.rewardExcludedQuantity > 0)
)

const selectedMethod = computed(() => orderSummaryStore.orderSummary.selectedMethod)
const selectedAddress = computed(() => orderSummaryStore.orderSummary.selectedAddress)
const distance = computed(() => orderSummaryStore.orderSummary.distance)
const formattedDistance = computed(() => {
  if (distance.value !== null) {
    return distance.value >= 1000 ? (distance.value / 1000).toFixed(1) + ' km' : distance.value + ' m'
  }
  return ''
})

const deliveryFee = computed(() => orderSummaryStore.orderSummary.deliveryFee)
const usedPointInput = ref(orderSummaryStore.orderSummary.usedPoint ?? 0)

watch(usedPointInput, (val) => {
  orderSummaryStore.updateOrderSummary({ usedPoint: val })
})

function validateUsedPoint() {
  const capped = Math.max(0, Math.min(usedPointInput.value, availablePoint.value))
  usedPointInput.value = capped
}

watch(() => orderSummaryStore.orderSummary.usedPoint, (newValue) => {
  usedPointInput.value = newValue
})

const selectedCoupons = computed(() => orderSummaryStore.orderSummary.selectedCoupons)
const usableCoupons = computed(() => optimizer.usableCoupons)

const finalAmount = computed(() =>
  Math.max(0, cartTotal.value - couponDiscount.value + deliveryFee.value - usedPointInput.value)
)

const paymentMethod = computed({
  get: () => orderSummaryStore.orderSummary.paymentMethod,
  set: (value: string) => {
    orderSummaryStore.updateOrderSummary({ paymentMethod: value })
  }
})

function selectMethod(m: string) {
  orderSummaryStore.updateOrderSummary({ selectedMethod: m })
  orderSummaryStore.updateSelectedAddress()
}

function selectPaymentMethod(method: string) {
  orderSummaryStore.updateOrderSummary({ paymentMethod: method })
}

function toggleCoupon(coupon: IssuedCoupon) {
  const index = selectedCoupons.value.findIndex(c => c.id === coupon.id)
  if (index === -1) {
    selectedCoupons.value.push(coupon)
  } else {
    selectedCoupons.value.splice(index, 1)
  }
  orderSummaryStore.updateSelectedCoupons(selectedCoupons.value)
  recalculateUsedPoint()
}

function recalculateUsedPoint() {
  if (useMaxPoint.value) {
    const afterCouponAmount = Math.max(0, cartTotal.value + deliveryFee.value - couponDiscount.value)
    usedPointInput.value = Math.min(afterCouponAmount, availablePoint.value)
    orderSummaryStore.updateOrderSummary({ usedPoint: usedPointInput.value })
  } else {
    orderSummaryStore.updateOrderSummary({ usedPoint: usedPointInput.value })
  }
}

function goToAddressManage() {
  router.push('/mypage/address')
}
const isPlacingOrder = ref(false)

async function placeOrder() {
  if (isPlacingOrder.value) return
  isPlacingOrder.value = true

  try {
    if (!companyStore.currentCompanyId) return alert('회사를 선택해주세요.')
    if (!userAuthStore.currentUser?.uid) return alert('로그인 후 주문해주세요.')
    if (cartStore.items.length === 0) return alert('장바구니에 상품이 없습니다.')

    const orderService = createOrderService()
    if (finalAmount.value === 0) {
      orderSummaryStore.updateOrderSummary({ paymentMethod: 'zeropay' })
    }

    const now = Timestamp.now()
    const today = new Date()
    const yyyymmdd = Number(format(today, 'yyyyMMdd'))
    const yyyymm = Number(format(today, 'yyyyMM'))

    const order: Order = {
      ...orderSummaryStore.orderSummary,
      cartItems: cartStore.items,
      selectedCoupons: orderSummaryStore.orderSummary.selectedCoupons.map(c => ({ ...c, usedAmount: c.usedAmount ?? 0 })),
      paymentMethod: orderSummaryStore.orderSummary.paymentMethod as Order['paymentMethod'],
      selectedMethod: orderSummaryStore.orderSummary.selectedMethod as Order['selectedMethod'],
      companyId: companyStore.currentCompanyId,
      customerId: userAuthStore.currentUser.uid,
      orderStatus: 'pending',
      processStatus: 'waitingConfirm',
      dateCreated: now,
      dateModified: now,
      productTotalAmount: cartStore.cartTotal,
      couponDiscountTotal: optimizer.calculateCouponDiscountForSelected(),
      finalAmount: finalAmount.value,
      deliveryFee: orderSummaryStore.orderSummary.deliveryFee,
      distance: orderSummaryStore.orderSummary.distance ?? 0,
      selectedAddress: orderSummaryStore.orderSummary.selectedAddress!,
      customerMemo: orderSummaryStore.orderSummary.customerMemo ?? '',
      rewardPointPlanned: rewardPointPlanned.value,
      rewardStampPlanned: rewardStampPlanned.value,
      paidAmount: 0,
      datePayment: Timestamp.fromMillis(0),
      paymentConfirmed: false,
      dateCreatedYYYYmmdd: yyyymmdd,
      dateCreatedYYYYmm: yyyymm,
      pgPaidAmount: 0,
      paymentLogs: [],
    }

    const clientSnapshot = {
      customerCompanyActivity: {
        pointRemaining: userAuthStore.customerCompanyActivity?.pointRemaining ?? 0,
        stampRemaining: userAuthStore.customerCompanyActivity?.stampRemaining ?? 0,
      },
    }

    const res = await orderService.placeOrder(companyStore.currentCompanyId, order, clientSnapshot)

    const clientId = companyStore.currentCompany?.nicepayConfig.clientId
    if (!clientId) return alert('결제 서비스 설정이 필요합니다.')

    if (res.isSuccess && res.data) {
      tempOrderId.value = res.data.id

      if (orderSummaryStore.orderSummary.paymentMethod === 'easy') {
        showCardSlider.value = true
        return
      }
      const isZeroPayLike = ['onsite', 'bank', 'zeropay'].includes(orderSummaryStore.orderSummary.paymentMethod)
      if (isZeroPayLike) {
        orderSummaryStore.$reset()
        router.push(`/${companyStore.currentCompanyId}/payment/complete?orderId=${res.data.id}`)
      } else {
        serverAuth({
          orderId: res.data.id,
          amount: finalAmount.value,
          clientId: clientId,
          method: orderSummaryStore.orderSummary.paymentMethod,
        })
      }
    } else {
      alert('주문 실패: ' + (res.message || '알 수 없는 오류'))
    }

  } catch (e) {
    console.error('❌ 주문 처리 중 오류:', e)
    alert('주문 처리 중 오류가 발생했습니다.')
  } finally {
    isPlacingOrder.value = false
  }
}



type PaymentParams = {
  orderId: string
  amount: number
  clientId: string
  method?: string
}

function serverAuth({ orderId, amount, clientId, method = 'card' }: PaymentParams) {
  const config = useRuntimeConfig()
  const PAYMENT_RETURN_URL = config.public.PAYMENT_RETURN_URL as string | undefined
  //'http://127.0.0.1:5001/farmsns-main/asia-northeast3/api/api/payment/complete',
  if (!PAYMENT_RETURN_URL) {
    alert('결제 서비스가 초기화되지 않았습니다.')
    return
  }
  window.AUTHNICE.requestPay({
    clientId,
    method,
    orderId,
    amount,
    goodsName: '주문 상품',
    returnUrl: PAYMENT_RETURN_URL,
    fnError: ({ errorMsg }: any) => alert('결제 오류: ' + errorMsg),
  })
}

function close() {
  router.back()
}

onMounted(() => {
  orderSummaryStore.updateSelectedAddress()
  if (!window.AUTHNICE) {
    const script = document.createElement('script')
    script.src = 'https://pay.nicepay.co.kr/v1/js/'
    document.head.appendChild(script)
  }
})
</script>
