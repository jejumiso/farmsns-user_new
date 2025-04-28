
// // stores/view/order/useOrderViewStore.ts
// import { defineStore } from 'pinia'
// import type { IssuedCoupon } from '@/shared-types/coupon/issuedCoupon'

// export const useOrderViewStore = defineStore('orderView', {
//   state: () => ({
//     selectedMethod: 'takeout', 
//     usedPoint: 0,
//     paymentMethod: 'easy',
//     scrollTop: 0,
//   }),

//   persist: {
//     storage: sessionStorage
//   },

//   actions: {
//     reset() {
//       this.selectedMethod = 'takeout'
//       this.usedPoint = 0
//       this.paymentMethod = 'easy'
//       this.scrollTop = 0
//     },
//   }
// })
