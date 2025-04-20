<template>
  <div class="p-4 max-w-2xl mx-auto space-y-6">
    <!-- 주문 방식 선택 -->
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

    <!-- 배송지 선택 -->
    <div v-if="selectedMethod === 'delivery'" class="bg-gray-100 p-3 rounded-md">
      <p class="font-medium">배송지</p>
      <div v-if="addresses.length">
        <p>{{ selectedAddress?.label }} - {{ selectedAddress?.address_name }}</p>
        <button @click="goToAddressManage" class="text-sm text-blue-500">배송지 변경 &gt;</button>
      </div>
      <div v-else>
        <p>배송지가 없습니다.</p>
        <button @click="goToAddressManage" class="text-sm text-blue-500">배송지 등록하기 &gt;</button>
      </div>
    </div>

    <!-- 포인트 -->
    <div>
      <p class="font-medium">포인트</p>
      <p>보유: {{ availablePoint.toLocaleString() }}P</p>
      <input type="number" v-model.number="usedPoint" class="border border-gray-300 px-3 py-2 w-full rounded-md mt-1" :max="availablePoint" />
    </div>

    <!-- 쿠폰 -->
    <div>
      <p class="font-medium">쿠폰</p>
      <select v-model="selectedCouponId" class="border border-gray-300 px-3 py-2 w-full rounded-md">
        <option value="">쿠폰 선택 안 함</option>
        <option v-for="coupon in coupons" :key="coupon.id" :value="coupon.id">
          {{ coupon.nameCoupon }} ({{ coupon.pointRemaining }}P)
        </option>
      </select>
    </div>

    <!-- 결제 수단 -->
    <div>
      <p class="font-medium">결제 수단</p>
      <div class="flex gap-3">
        <label v-for="method in paymentMethods" :key="method.value" class="flex items-center gap-2">
          <input type="radio" :value="method.value" v-model="paymentMethod" />
          {{ method.label }}
        </label>
      </div>
    </div>

    <!-- 결제 요약 -->
    <div class="bg-gray-100 p-4 rounded-md space-y-2">
      <p>상품 총액: ₩{{ totalProductPrice.toLocaleString() }}</p>
      <p>쿠폰 할인: -₩{{ couponDiscount.toLocaleString() }}</p>
      <p>포인트 사용: -₩{{ usedPoint.toLocaleString() }}</p>
      <hr />
      <p class="font-bold">결제할 금액: ₩{{ finalAmount.toLocaleString() }}</p>
    </div>

    <!-- 주문하기 버튼 -->
    <button
      @click="placeOrder"
      class="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      주문하기
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'

const router = useRouter()
const authStore = useUserAuthStore()

const methods = [
  { value: 'takeout', label: '포장' },
  { value: 'dinein', label: '매장' },
  { value: 'delivery', label: '배달' },
] as const

type OrderMethod = typeof methods[number]['value']
const selectedMethod = ref<OrderMethod>('takeout')

function selectMethod(method: OrderMethod) {
  selectedMethod.value = method
}

// 배송지
const addresses = authStore.customerProfile?.deliveryAddressList || []
const selectedAddressId = ref<string | null>(addresses[0]?.id ?? null)
const selectedAddress = computed(() =>
  addresses.find(a => a.id === selectedAddressId.value)
)

function goToAddressManage() {
  router.push('/my/address')
}

// 포인트
const availablePoint = authStore.customerCompanyActivity?.pointRemaining ?? 0
const usedPoint = ref(0)

// 쿠폰
const coupons = ref([
  { id: 'c1', nameCoupon: '2000원 할인', pointRemaining: 2000 },
  { id: 'c2', nameCoupon: '아메리카노 무료', pointRemaining: 4500 },
])
const selectedCouponId = ref<string | null>(null)
const couponDiscount = computed(() =>
  coupons.value.find(c => c.id === selectedCouponId.value)?.pointRemaining ?? 0
)

// 결제 수단
const paymentMethods = [
  { value: 'onsite', label: '현장 결제' },
  { value: 'card', label: '카드 결제' },
  { value: 'bank', label: '무통장 입금' },
] as const
const paymentMethod = ref<typeof paymentMethods[number]['value']>('onsite')

// 상품 총액 및 최종 금액
const totalProductPrice = ref(15000)
const finalAmount = computed(() =>
  totalProductPrice.value - couponDiscount.value - usedPoint.value
)

function placeOrder() {
  alert('✅ 주문 완료 (데모입니다)')
}
</script>
