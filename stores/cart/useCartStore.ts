// 📁 stores/cart/useCartStore.ts
import { defineStore } from 'pinia'
import type { Product } from '@/shared-types/product/product'

export interface CartItem {
  id: number // ✅ 고유 ID 추가
  productId: string
  productName: string
  priceSale: number
  quantity: number
  image: string
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

    totalPrice: state =>
      state.items.reduce(
        (sum, item) =>
          sum +
          item.quantity *
            (item.priceSale +
              item.options.reduce((oSum, o) => oSum + o.price, 0)),
        0
      ),
  },

  actions: {
    /**
     * 상품과 옵션을 장바구니에 담기
     */
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
          id: Date.now(), // ✅ 유니크 ID 생성
          productId: product.id,
          productName: product.productName,
          priceSale: product.priceSale,
          quantity,
          image: product.imageThumbnailFileName,
          options,
        }

        this.items.push(newItem)
      }
    },

    /**
     * 고유 ID 기준으로 장바구니 항목 삭제
     */
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
