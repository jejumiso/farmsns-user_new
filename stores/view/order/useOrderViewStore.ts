import { defineStore } from 'pinia'

export const useOrderViewStore = defineStore('orderView', {
  state: () => ({
    selectedMethod: 'takeout', // 'takeout' | 'dinein' | 'delivery'
    usedPoint: 0,
    selectedCouponId: null as string | null,
    paymentMethod: 'onsite',
    scrollTop: 0,
  }),
  persist: true // ✅ 로컬에 유지
})
