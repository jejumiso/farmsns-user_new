import { defineStore } from 'pinia'

export const useOrderViewStore = defineStore('orderView', {
  state: () => ({
    selectedMethod: 'takeout', // 'takeout' | 'dinein' | 'delivery'
    usedPoint: 0,
    selectedCouponId: null as string | null,
    paymentMethod: 'easy',
    scrollTop: 0,
  }),
  persist: true, // ✅ 로컬에 유지
  actions: {
    reset() {
      this.selectedMethod = 'takeout'
      this.usedPoint = 0
      this.selectedCouponId = null
      this.paymentMethod = 'easy'
      this.scrollTop = 0
    }
  }
})
