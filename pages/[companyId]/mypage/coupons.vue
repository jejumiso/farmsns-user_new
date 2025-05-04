<template>
    <div class="p-6 max-w-md mx-auto space-y-4">
      <h1 class="text-xl font-bold text-center">🎟️ 보유 쿠폰</h1>
  
      <div v-if="coupons.length" class="space-y-4">
        <div
          v-for="coupon in coupons"
          :key="coupon.id"
          class="bg-white rounded-lg shadow p-4 border border-gray-200"
        >
          <h2 class="text-lg font-semibold text-gray-800">{{ coupon.couponName }}</h2>
          <p class="text-sm text-gray-600">이벤트명: {{ coupon.eventName }}</p>
  
          <p class="text-sm mt-1">
            할인: <span v-if="coupon.type === 'percentDiscount'">
              {{ coupon.discountRate }}%<span v-if="coupon.discountMaxAmount"> (최대 {{ coupon.discountMaxAmount.toLocaleString() }}원)</span>
            </span>
            <span v-else-if="coupon.type === 'fixedAmountDiscount'">
              {{ coupon.discountAmount.toLocaleString() }}원 할인
            </span>
            <span v-else>
              무료 상품 쿠폰
            </span>
          </p>
  
          <p class="text-sm mt-1 text-gray-700">상태: {{ statusLabel(coupon.status) }}</p>
          <p class="text-sm text-gray-500">
            유효기간: <span v-if="coupon.dateExpiration">{{ formatExpiration(coupon.dateExpiration) }}</span><span v-else>제한 없음</span>
          </p>
  
          <p v-if="coupon.memo" class="text-xs text-gray-400 mt-2">💬 {{ coupon.memo }}</p>
        </div>
      </div>
  
      <div v-else class="text-center text-gray-400 mt-20">
        🎟️ 보유 중인 쿠폰이 없습니다.
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useCouponStore } from '@/stores/coupon/useCouponStore'
  import { computed } from 'vue'
  import { format } from 'date-fns'
  import type { Timestamp } from '@/shared/firebase/firebaseTypes'
  
  const couponStore = useCouponStore()
  const coupons = computed(() => couponStore.coupons)
  
  function statusLabel(status: 'active' | 'used' | 'expired') {
    switch (status) {
      case 'active': return '사용 가능'
      case 'used': return '사용 완료'
      case 'expired': return '기간 만료'
      default: return '알 수 없음'
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
  
  </script>
  
  <style scoped>
  </style>
  