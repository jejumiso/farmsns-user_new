// 📁 stores/cart/useCartStore.ts
import { defineStore } from 'pinia'
import type { Product } from '@/shared-types/product/product'
import type { FixedAmountIssuedCoupon, IssuedCoupon } from '~/shared-types/coupon/issuedCoupon'
import type { CartItem } from '~/shared-types/cart/cartItem'



export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],

  }),
  persist: true,

  getters: {
    // 쿠폰·포인트 적용 전 장바구니 총액 (할인가 × 수량)
    cartTotal: (state) =>
      state.items.reduce((sum, item) => sum + item.priceDiscounted * item.quantity, 0),
  
    // 전체 상품 수량
    totalQuantity: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
  
    // 옵션 포함 결제 최종 금액 (할인가 + 옵션가) × 수량
    totalFinalPrice: (state) =>
      state.items.reduce(
        (sum, item) =>
          sum +
          item.quantity *
            (item.priceDiscounted +
              item.options.reduce((oSum, o) => oSum + o.price, 0)),
        0
      ),
  
    // 전체 원가 (원가 × 수량)
    totalOriginalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity * item.priceOriginal, 0),
  
    // 적립 예정 포인트 합계
    totalRewardPoint: (state) =>
      state.items.reduce((sum, item) => sum + item.rewardPoint * item.quantity, 0),
  
    // 적립 예정 스탬프 합계
    totalRewardStamp: (state) =>
      state.items.reduce((sum, item) => sum + item.rewardStamp * item.quantity, 0),
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
    applyRewardExclusion(selectedCouponIds: IssuedCoupon[]) {
      // 초기화
      this.items.forEach(item => {
        item.rewardExcludedQuantity = 0;
      });
    
      // 퍼센트 할인쿠폰이 하나라도 선택되었으면 전체 리워드 제외
      const percentCouponSelected = selectedCouponIds
        .some(coupon => coupon.type === 'percentDiscount');
    
      if (percentCouponSelected) {
        // 퍼센트 할인쿠폰이 하나라도 선택되었으면 전체 리워드 제외
        this.items.forEach(item => {
          item.rewardExcludedQuantity = item.quantity;
        });
        return;
      }
    
      // 금액 할인쿠폰만 필터링
      const fixedCoupons = selectedCouponIds.filter(
        (coupon): coupon is FixedAmountIssuedCoupon => coupon.type === 'fixedAmountDiscount'
      );
    
      let totalFixedDiscount = fixedCoupons.reduce((sum, coupon) => sum + coupon.discountAmount, 0);
    
      // 비싼 상품부터 정렬
      const sortedItems = [...this.items].sort((a, b) => {
        const aPrice = a.priceDiscounted + a.options.reduce((oSum, o) => oSum + o.price, 0);
        const bPrice = b.priceDiscounted + b.options.reduce((oSum, o) => oSum + o.price, 0);
        return bPrice - aPrice;
      });
    
      // 리워드 제외 수량 적용
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
    // setDeliveryFee(fee: number) {
    //   this.deliveryFee = fee;  // 배달비 설정
    // },
    // // 추가: 배송비 계산 메소드
    // calculateDeliveryFee(distance: number, deliveryFee: DeliveryFee): number {
    //   // 기본 거리 이내는 기본 배송비만 적용
    //   if (distance <= deliveryFee.baseDistance) {
    //     return deliveryFee.baseFee;
    //   }

    //   // 기본 거리 이후 추가 요금 계산
    //   const extraDistance = Math.ceil((distance - deliveryFee.baseDistance) / deliveryFee.additionalDistance);
    //   const extraFee = extraDistance * deliveryFee.additionalFee;

    //   // 총 배송비 계산
    //   return deliveryFee.baseFee + extraFee;
    // },

    

        
  
  },
})
