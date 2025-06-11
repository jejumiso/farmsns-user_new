// 파일: stores/cart/useCartStore.ts

import { defineStore } from 'pinia'
import type { Product } from '@/shared-types/product/product'
import type { FixedAmountIssuedCoupon, IssuedCoupon } from '~/shared-types/coupon/issuedCoupon'
import type { CartItem } from '~/shared-types/cart/cartItem'
import { useUserAuthStore } from '../userAuth/useUserAuthStore'
import { getEffectivePrice } from '~/utils/price/getEffectivePrice'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  persist: true,

  getters: {
    cartTotalBase: (state) =>
      state.items.reduce((sum, item) => sum + item.priceDiscounted * item.quantity, 0),

    totalQuantity: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    cartTotalWithOptions: (state) =>
      state.items.reduce(
        (sum, item) =>
          sum +
          item.quantity *
            (item.priceDiscounted +
              item.options.reduce((oSum, o) => oSum + o.price, 0)),
        0
      ),

    totalOriginalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity * item.priceOriginal, 0),

    totalRewardPoint: (state) =>
      state.items.reduce((sum, item) => sum + item.rewardPoint * item.quantity, 0),

    totalRewardStamp: (state) =>
      state.items.reduce((sum, item) => sum + item.rewardStamp * item.quantity, 0),
  },

  actions: {
    addToCartWithOptions(product: Product, options: CartItem['options'], quantity: number) {
      const key = `${product.id}-${JSON.stringify(options)}`
      const existing = this.items.find((i) => `${i.productId}-${JSON.stringify(i.options)}` === key)

      const authStore = useUserAuthStore()
      const isFriendtalk = authStore.friendtalkReceiver &&
                          product.priceFriendtalk &&
                          product.priceFriendtalk > 0 &&
                          product.priceDiscounted > product.priceFriendtalk

      const effectivePrice = getEffectivePrice(product)


      if (existing) {
        existing.quantity += quantity
      } else {
        const newItem: CartItem = {
          id: Date.now(),
          productId: product.id,
          productName: product.productName,
          priceOriginal: product.priceOriginal,
          priceDiscounted: effectivePrice,  // ✅ 여기!
          priceType: isFriendtalk ? 'friendtalk' : 'default',
          quantity,
          image: product.imageThumbnailFileName,
          rewardStamp: isFriendtalk? 0 : product.rewardStamp,
          rewardPoint: isFriendtalk? 0 : product.rewardPoint,
          rewardExcludedQuantity: 0,
          parcelBundleValue: product.parcelBundleValue ?? undefined,
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

    applyRewardExclusion(selectedCouponIds: IssuedCoupon[]) {
      // 초기화
      this.items.forEach(item => {
        item.rewardExcludedQuantity = 0;
      });

      const percentCouponSelected = selectedCouponIds.some(coupon => coupon.type === 'percentDiscount');

      if (percentCouponSelected) {
        this.items.forEach(item => {
          item.rewardExcludedQuantity = item.quantity;
        });
        return;
      }

      const fixedCoupons = selectedCouponIds.filter(
        (coupon): coupon is FixedAmountIssuedCoupon => coupon.type === 'fixedAmountDiscount'
      );

      // ✔️ 수정한 부모
      let totalFixedDiscount = fixedCoupons.reduce((sum, coupon) => sum + coupon.usedAmount, 0);

      const sortedItems = [...this.items].sort((a, b) => {
        const aPrice = a.priceDiscounted + a.options.reduce((oSum, o) => oSum + o.price, 0);
        const bPrice = b.priceDiscounted + b.options.reduce((oSum, o) => oSum + o.price, 0);
        return bPrice - aPrice;
      });

      for (const item of sortedItems) {
        const unitPrice = item.priceDiscounted + item.options.reduce((oSum, o) => oSum + o.price, 0);
        for (let i = 0; i < item.quantity; i++) {
          if (totalFixedDiscount >= unitPrice) {
            item.rewardExcludedQuantity += 1;
            totalFixedDiscount -= unitPrice;
          } else if (totalFixedDiscount > 0) {
            item.rewardExcludedQuantity += 1;
            totalFixedDiscount = 0;
            break;
          } else {
            break;
          }
        }
        if (totalFixedDiscount <= 0) break;
      }
    },
  },
})
