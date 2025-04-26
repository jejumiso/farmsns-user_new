// 📁 stores/cart/useCartStore.ts
import { defineStore } from 'pinia'
import type { Product } from '@/shared-types/product/product'

export interface CartItem {
  id: number
  productId: string
  productName: string
  priceOriginal: number
  priceDiscounted: number
  quantity: number
  image: string
  rewardStamp: number          // 추가됨 ✅
  rewardPoint: number          // 추가됨 ✅
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
    totalQuantity: state =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    totalFinalPrice: state =>
      state.items.reduce(
        (sum, item) =>
          sum +
          item.quantity *
            (item.priceDiscounted +
              item.options.reduce((oSum, o) => oSum + o.price, 0)),
        0
      ),

    totalOriginalPrice: state =>
      state.items.reduce(
        (sum, item) => sum + item.quantity * item.priceOriginal,
        0
      ),

    totalRewardStamp: state => // ✅ 총 스탬프 계산 getter 추가
      state.items.reduce(
        (sum, item) => sum + item.quantity * item.rewardStamp,
        0
      ),

    totalRewardPoint: state => // ✅ 총 포인트 계산 getter 추가
      state.items.reduce(
        (sum, item) => sum + item.quantity * item.rewardPoint,
        0
      ),
  },

  actions: {
    addToCartWithOptions(
      product: Product,
      options: CartItem['options'],
      quantity: number
    ) {
      const key = `${product.id}-${JSON.stringify(options)}`
      const existing = this.items.find(
        i => `${i.productId}-${JSON.stringify(i.options)}` === key
      )

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
          rewardStamp: product.rewardStamp,  // 추가됨 ✅
          rewardPoint: product.rewardPoint,  // 추가됨 ✅
          options,
        }

        this.items.push(newItem)
      }
    },

    removeItemById(index: number) {
      this.items.splice(index, 1)
    },

    updateQuantity(index: number, newQty: number) {
      if (newQty < 1) return
      this.items[index].quantity = newQty
    },

    clearCart() {
      this.items = []
    },
  },
})
