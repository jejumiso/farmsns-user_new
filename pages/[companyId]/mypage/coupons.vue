<template>
  <div class="p-6 max-w-md mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-center text-purple-700">🎟️ 나의 쿠폰</h1>

    <div v-if="coupons.length" class="space-y-4">
      <div
        v-for="coupon in coupons"
        :key="coupon.id"
        class="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-300 rounded-xl p-4 shadow hover:shadow-md transition"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-purple-800">{{ coupon.couponName }}</h2>
          <span
            :class="[ 
              'text-xs px-2 py-0.5 rounded-full font-medium',
              coupon.status === 'active' ? 'bg-green-100 text-green-700' :
              coupon.status === 'used' ? 'bg-gray-200 text-gray-500' :
              coupon.status === 'requested' ? 'bg-yellow-100 text-yellow-700' :
              coupon.status === 'cancelled' ? 'bg-gray-100 text-gray-500' :
              'bg-red-100 text-red-600'
            ]"
          >
            {{ statusLabel(coupon.status) }}
          </span>
        </div>

        <p class="text-sm text-gray-600 mt-1">
          이벤트: <span class="font-medium">{{ coupon.eventName }}</span>
        </p>

        <p class="text-sm text-gray-700 mt-1">
          할인:
          <span v-if="coupon.type === 'percentDiscount'">
            {{ coupon.discountRate }}%
            <span v-if="coupon.discountMaxAmount">(최대 {{ coupon.discountMaxAmount.toLocaleString() }}원)</span>
          </span>
          <span v-else-if="coupon.type === 'fixedAmountDiscount'">
            {{ coupon.discountAmount.toLocaleString() }}원 할인
          </span>
          <span v-else>무료 상품 쿠폰</span>
        </p>

        <p class="text-sm text-gray-500 mt-1">
          유효기간:
          <span v-if="coupon.dateExpiration">{{ formatExpiration(coupon.dateExpiration) }}</span>
          <span v-else>제한 없음</span>
        </p>

        <p v-if="coupon.memo" class="text-xs text-gray-400 mt-2">💬 {{ coupon.memo }}</p>

        <!-- 사용 안내 or 버튼 -->
        <div class="mt-4">
          <p
            v-if="coupon.whereToUse === 'web'"
            class="text-xs text-gray-500 italic"
          >
            📦 웹 주문 전용 쿠폰입니다.
          </p>
          

          <button
            v-else-if="(coupon.whereToUse === 'offline' || coupon.whereToUse === 'all') && coupon.status === 'active'"
            @click="requestCouponUse(coupon.id)"
            class="mt-2 w-full text-sm text-white bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md transition"
          >
            ✋ 쿠폰 사용 요청
          </button>

          <p
            v-else-if="coupon.status === 'requested'"
            class="text-xs text-yellow-600 mt-2"
          >
            ⏳ 사용 요청 중입니다. 승인 대기 중입니다.
          </p>

          <p
            v-else-if="coupon.status === 'cancelled'"
            class="text-xs text-gray-400 mt-2"
          >
            ❌ 요청이 취소되었습니다. 다시 요청해주세요.
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-400 mt-20 text-sm">
      🎟️ 보유 중인 쿠폰이 없습니다.
    </div>
  </div>
</template>



<script setup lang="ts">
import { useCouponStore } from '@/stores/coupon/useCouponStore'
import { computed } from 'vue'
import { format } from 'date-fns'
import type { Timestamp } from '@/shared/firebase/firebaseTypes'
import { useApi } from '~/composables/useApi'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore';
const couponStore = useCouponStore()
const coupons = computed(() => couponStore.coupons)
const toast = useToast()
const api = useApi()
const authStore = useUserAuthStore()

function statusLabel(status: 'active' | 'used' | 'expired' | 'requested' | 'cancelled') {
  switch (status) {
    case 'active':
      return '사용 가능'
    case 'used':
      return '사용 완료'
    case 'expired':
      return '기간 만료'
    case 'requested':
      return '사용요청'
    case 'cancelled':
      return '취소됨'
    default:
      return '알 수 없음'
  }
}

function formatExpiration(ts: Timestamp) {
  try {
    const date = ts.toDate()
    return format(date, 'yyyy.MM.dd')
  } catch {
    return '날짜 오류'
  }
}

// ✅ 사용요청 API 호출
async function requestCouponUse(couponId: string) {
  const confirmed = window.confirm('사용 요청하시겠습니까?\n직원이 확인 후 사용 처리 됩니다.')
  if (!confirmed) return

  try {
    const { data } = await api.post('/api/coupon/request-use', 
    { 
      couponId,
      uid: authStore.currentUser?.uid
    })

    if (data?.isSuccess) {
      toast.add({ title: '사용 요청이 완료되었습니다.', color: 'success' })
      await couponStore.fetchMyModifiedCoupons()
    } else {
      toast.add({ title: data?.message ?? '요청 실패', color: 'warning' })
    }
  } catch (err) {
    console.error('사용 요청 실패:', err)
    toast.add({ title: '요청 중 오류가 발생했습니다.', color: 'error' })
  }
}

</script>



  
  <style scoped>
  </style>
  