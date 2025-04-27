<template>
  <div class="p-6 max-w-md mx-auto space-y-4">
    <header class="flex justify-between p-4 border-b shadow-sm bg-white sticky top-0 z-50">
      <h1 class="font-bold text-lg">주문하기</h1>
      <button
        @click="close"
        aria-label="닫기"
        class="text-gray-500 text-xl leading-none"
        type="button"
      >
        ×
      </button>
    </header>

    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      <!-- 주문 방식 -->
      <div class="flex gap-2 justify-center">
        <button
          v-for="method in methods"
          :key="method.value"
          @click="selectMethod(method.value)"
          :class="[
            'px-4 py-2 rounded-md',
            selectedMethod === method.value
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-black'
          ]"
          type="button"
        >
          {{ method.label }}
        </button>
      </div>

      <!-- 배송지 선택 -->
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
          🗺️ 가게↔배송지 거리: <strong>{{ distance.toFixed(2) }} km</strong>
        </p>
        <p v-else>거리 정보를 불러오는 중…</p>
      </div>

      <!-- 장바구니 요약 -->
      <div class="bg-gray-50 p-4 rounded-md">
        <h2 class="font-semibold text-lg mb-4">🛒 주문 요약</h2>
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="flex justify-between border-b py-2 text-sm"
        >
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

          <div
            v-if="hasExcludedReward"
            class="mt-2 text-red-500 text-xs"
          >
            ※ 일부 상품은 할인 적용으로 리워드가 제외됩니다.
          </div>

          <hr class="my-2" />
          <p class="text-lg font-bold">
            최종 결제금액: {{ finalAmount.toLocaleString() }}원
          </p>
        </div>
      </div>

      <!-- 쿠폰 선택 -->
      <div>
        <p class="font-medium">쿠폰 선택</p>
        <div v-for="coupon in coupons" :key="coupon.id" class="flex items-center gap-2">
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


      <!-- 포인트 사용 -->
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

      <!-- 결제 수단 -->
      <div>
        <p class="font-medium">결제 수단</p>
        <div class="flex gap-3 flex-wrap">
          <label
            v-for="method in paymentMethods"
            :key="method.value"
            class="flex items-center gap-2"
          >
            <input type="radio" v-model="paymentMethod" :value="method.value" />
            {{ method.label }}
          </label>
        </div>
      </div>

      <button
        @click="placeOrder"
        class="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
        type="button"
      >
        주문하기
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
import { useCompanyStore } from '@/stores/company/useCompanyStore'
import { useCouponOptimizer } from '~/composables/coupon/useCouponOptimizer'
import type { GeoPoint } from '~/shared/firebase/firebaseTypes'
import type { IssuedCoupon } from '~/shared-types/coupon/issuedCoupon'

// — 상수 정의 — 
const methods = [
  { value: 'takeout', label: '포장' },
  { value: 'dinein', label: '매장' },
  { value: 'delivery', label: '배달' },
] as const

const paymentMethods = [
  { value: 'onsite', label: '현장 결제' },
  { value: 'card', label: '카드 결제' },
  { value: 'bank', label: '무통장 입금' },
  { value: 'naverpay', label: '네이버페이' },
  { value: 'kakaopay', label: '카카오페이' },
  { value: 'easy', label: '비밀번호 간편결제' },
] as const

// — 라우터 & 스토어 초기화 —
const router = useRouter()
const cartStore = useCartStore()
const couponStore = useCouponStore()
const authStore = useUserAuthStore()
const viewStore = useOrderViewStore()
const companyStore = useCompanyStore()
const optimizer = useCouponOptimizer()

// — 로컬 상태 — 
// 이용자의 보유포인트트
const availablePoint = ref(0) // 초기값을 0으로 설정
watch(() => authStore.customerCompanyActivity, (newValue) => {
  if (newValue?.pointRemaining !== undefined) {
    availablePoint.value = newValue.pointRemaining
  }
}, { immediate: true })  // immediate: true로 초기화 시점에도 바로 실행되도록 설정


const useMaxPoint = ref(false)
// 카트상품
const cartItems = cartStore.items        // ref<CartItem[]>
// 카트상품의 원가
const cartTotal = cartStore.cartTotal    // ComputedRef<number>
// 쿠폰으로 할인 받는 금액
const couponDiscount = computed(() => {
  return optimizer.calculateCouponDiscountForSelected(); // 쿠폰 할인 금액 계산
})

// 사용 가능한 쿠폰 목록
const usableCoupons = computed(() => {
  return optimizer.usableCoupons; 
})

// 포인트 사용까지 계산된 최종 결제 금액액
const finalAmount = computed(() =>
  Math.max(0, cartTotal - couponDiscount.value - usedPoint.value)
)

const usedPoint = computed<number>({
  get: () => viewStore.usedPoint,
  set: (v) => (viewStore.usedPoint = v),
})

const coupons = computed(() => couponStore.coupons)
const selectedCoupons = computed(() => viewStore.selectedCoupons)

const rewardPointPlanned = computed(() =>
  cartItems.reduce(
    (sum, item) => sum + (item.quantity - item.rewardExcludedQuantity) * item.rewardPoint,
    0
  )
)
const rewardStampPlanned = computed(() =>
  cartItems.reduce(
    (sum, item) => sum + (item.quantity - item.rewardExcludedQuantity) * item.rewardStamp,
    0
  )
)

const hasExcludedReward = computed(() =>
  cartItems.some(item => item.rewardExcludedQuantity > 0)
)

// ** paymentMethod 는 viewStore 이후에 선언 **
const paymentMethod = computed<typeof viewStore.paymentMethod>({
  get: () => viewStore.paymentMethod,
  set: (m) => { viewStore.paymentMethod = m }
})

type OrderMethod = typeof methods[number]['value']
const selectedMethod = computed<OrderMethod>({
  get: () => viewStore.selectedMethod as OrderMethod,
  set: (m) => (viewStore.selectedMethod = m),
})

const selectedAddress = computed(() => {
  const list = authStore.customerProfile?.deliveryAddressList ?? []
  const defId = authStore.customerProfile?.defaultDeliveryAddressId ?? null
  if (!list.length) return null
  return list.find(a => a.id === defId) ?? list[0]
})

function haversine(
  [lat1, lon1]: [number, number],
  [lat2, lon2]: [number, number]
): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

function toTuple(pt: GeoPoint): [number, number] {
  return [pt.latitude, pt.longitude]
}

const distance = computed<number | null>(() => {
  if (selectedMethod.value !== 'delivery') return null
  const addr = selectedAddress.value?.geoPoint
  const comp = companyStore.currentCompany?.businessInfo.geoPoint
  if (!addr || !comp) return null
  return haversine(toTuple(comp), toTuple(addr))
})

// — 이벤트 핸들러 & 유틸 — 
function selectMethod(m: OrderMethod) {
  selectedMethod.value = m
}

function handlePointInput() {
  if (usedPoint.value > availablePoint.value) {
    usedPoint.value = availablePoint.value
  }
  if (usedPoint.value < 0) {
    usedPoint.value = 0
  }
}

function toggleCoupon(issuedCoupon: IssuedCoupon) {
  viewStore.toggleCoupon(issuedCoupon)
}

function goToAddressManage() {
  router.push('/mypage/address')
}

function placeOrder() {
  alert('✅ 주문 완료 (데모입니다)')
}

function close() {
  router.back()
}



watch(useMaxPoint, (checked) => {
  if (checked) {
    const d = cartTotal - couponDiscount.value
    // 최대 포인트 사용 시, 결제 금액이 포인트 사용 가능 범위보다 클 경우만 포인트를 사용하도록 설정
    usedPoint.value = Math.min(availablePoint.value, d);
  }
});

watch([couponDiscount, usedPoint, useMaxPoint], () => {
  const after = Math.max(0, cartTotal - couponDiscount.value);  // 쿠폰 할인 후 결제 금액

  // useMaxPoint 체크박스가 체크된 경우
  if (useMaxPoint.value) {
    // 최대 포인트 사용 시, 결제 금액을 초과할 수 없도록 사용 가능한 최대 포인트로 설정
    usedPoint.value = Math.min(availablePoint.value, after);
  } else {
    // 체크되지 않은 경우, 사용자 지정 포인트 값 조정
    if (usedPoint.value > after) {
      usedPoint.value = after;  // 결제 금액을 초과할 수 없도록 조정
    }
  }
});


// 쿠폰 선택 변경 감지
watch(() => viewStore.selectedCoupons, () => {
  // 쿠폰 선택이 변경될 때마다 applyRewardExclusion 호출
  cartStore.applyRewardExclusion(viewStore.selectedCoupons);
}, { deep: true, immediate: true }); // deep: true는 배열 내용 변경을 감지하도록 설정
</script>
