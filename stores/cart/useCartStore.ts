// 📁 stores/cart/useCartStore.ts
import { defineStore } from 'pinia'
import type { Product } from '@/shared-types/product/product'
import type { FixedAmountIssuedCoupon, IssuedCoupon } from '~/shared-types/coupon/issuedCoupon'

export interface CartItem {
  id: number
  productId: string
  productName: string
  priceOriginal: number
  priceDiscounted: number
  quantity: number
  image: string
  rewardStamp: number
  rewardPoint: number
  rewardExcludedQuantity: number // ✅ 추가
  options: {
    optionId: string
    optionName: string
    selectedValue: string
    price: number
  }[]
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  persist: true,

  getters: {
    totalQuantity: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalFinalPrice: (state) => state.items.reduce((sum, item) =>
      sum + item.quantity * (item.priceDiscounted + item.options.reduce((oSum, o) => oSum + o.price, 0)),
    0),
    totalOriginalPrice: (state) => state.items.reduce((sum, item) =>
      sum + item.quantity * item.priceOriginal,
    0),
  
    // 🎯 추가하는 부분
    totalRewardPoint: (state) => state.items.reduce((sum, item) => sum + item.rewardPoint * item.quantity, 0),
    totalRewardStamp: (state) => state.items.reduce((sum, item) => sum + item.rewardStamp * item.quantity, 0),
  },
  

  actions: {
    addToCartWithOptions(product: Product, options: CartItem['options'], quantity: number) {
      const key = `${product.id}-${JSON.stringify(options)}`
      const existing = this.items.find((i) => `${i.productId}-${JSON.stringify(i.options)}` === key)

      if (existing) {
        existing.quantity += quantity
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          productId: product.id,
          productName: product.productName,
          priceOriginal: product.priceOriginal,
          priceDiscounted: product.priceDiscounted,
          quantity,
          image: product.imageThumbnailFileName,
          rewardStamp: product.rewardStamp,
          rewardPoint: product.rewardPoint,
          rewardExcludedQuantity: 0, // ✅ 초기값
          options,
        }
        this.items.push(newItem)
      }
    },

    clearCart() {
      this.items = []
    },

    removeItemById(index: number) {
      this.items.splice(index, 1)
    },

    updateQuantity(index: number, newQty: number) {
      if (newQty < 1) return
      this.items[index].quantity = newQty
    },
    applyRewardExclusion(selectedCouponIds: string[], availableCoupons: IssuedCoupon[]) {
      // 초기화
      this.items.forEach(item => {
        item.rewardExcludedQuantity = 0
      })
  
      const percentCouponSelected = selectedCouponIds
        .map(id => availableCoupons.find(c => c.id === id))
        .some(coupon => coupon?.type === 'percentDiscount')
  
      if (percentCouponSelected) {
        // 퍼센트 할인쿠폰이 하나라도 선택되었으면 전체 리워드 제외
        this.items.forEach(item => {
          item.rewardExcludedQuantity = item.quantity
        })
        return
      }
  
      // 퍼센트 쿠폰이 없으면 금액 할인 처리
      const fixedCoupons = selectedCouponIds
        .map(id => availableCoupons.find(c => c.id === id))
        .filter((c): c is FixedAmountIssuedCoupon => !!c && c.type === 'fixedAmountDiscount')
  
      let totalFixedDiscount = fixedCoupons.reduce((sum, coupon) => sum + coupon.discountAmount, 0)
  
      // 비싼 상품부터 정렬
      const sortedItems = [...this.items].sort((a, b) => {
        const aPrice = a.priceDiscounted + a.options.reduce((oSum, o) => oSum + o.price, 0)
        const bPrice = b.priceDiscounted + b.options.reduce((oSum, o) => oSum + o.price, 0)
        return bPrice - aPrice
      })
  
      for (const item of sortedItems) {
        const unitPrice = item.priceDiscounted + item.options.reduce((oSum, o) => oSum + o.price, 0)
        for (let i = 0; i < item.quantity; i++) {
          if (totalFixedDiscount >= unitPrice) {
            item.rewardExcludedQuantity += 1
            totalFixedDiscount -= unitPrice
          } else if (totalFixedDiscount > 0) {
            item.rewardExcludedQuantity += 1
            totalFixedDiscount = 0
            break
          } else {
            break
          }
        }
        if (totalFixedDiscount <= 0) break
      }
    },
  
  },
})
