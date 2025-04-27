import { defineStore } from 'pinia'
import type { IssuedCoupon } from '@/shared-types/coupon/issuedCoupon'

export const useOrderViewStore = defineStore('orderView', {
  state: () => ({
    selectedMethod: 'takeout', 
    usedPoint: 0,
    selectedCoupons: [] as IssuedCoupon[], // 쿠폰 객체 배열로 관리
    paymentMethod: 'easy',
    scrollTop: 0,
  }),

  persist: {
    storage: sessionStorage
  },

  actions: {
    reset() {
      this.selectedMethod = 'takeout'
      this.usedPoint = 0
      this.selectedCoupons = [] // 쿠폰 객체 배열 초기화
      this.paymentMethod = 'easy'
      this.scrollTop = 0
    },

    toggleCoupon(coupon: IssuedCoupon) {
      const idx = this.selectedCoupons.findIndex(c => c.id === coupon.id)
      if (idx === -1) {
        this.selectedCoupons.push(coupon) // 쿠폰 선택
      } else {
        this.selectedCoupons.splice(idx, 1) // 쿠폰 해제
      }
    }
  }
})
