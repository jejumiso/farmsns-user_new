import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart/useCartStore'
import { useCouponStore } from '@/stores/coupon/useCouponStore'
import { useOrderSummaryStore } from '~/stores/order/useOrderSummaryStore'
import type {
  IssuedCoupon,
  PercentIssuedCoupon,
  FixedAmountIssuedCoupon
} from '@/shared-types/coupon/issuedCoupon'

export const useCouponOptimizer = defineStore('couponOptimizer', () => {
  const couponStore = useCouponStore()
  const cartStore = useCartStore()
  const orderSummaryStore = useOrderSummaryStore()

  const selectedCoupons = computed(() => orderSummaryStore.orderSummary.selectedCoupons)
  const availableCoupons = computed(() => couponStore.availableCoupons)
  const cartTotal = computed(() => cartStore.cartTotal)

  // ✅ 장바구니 총액에서 쿠폰 할인 적용 후 금액 계산
  const calculateTotalWithCoupons = (coupons: IssuedCoupon[]) => {
    const discount = calculateCouponDiscount(coupons)
    return cartTotal.value - discount
  }

  // ✅ 선택된 쿠폰으로 할인 금액 계산
  const calculateCouponDiscountForSelected = () => {
    return calculateCouponDiscount(selectedCoupons.value)
  }

  // ✅ 쿠폰 배열로 할인 금액 계산 (각 쿠폰에 usedAmount를 직접 설정)
    const calculateCouponDiscount = (coupons: IssuedCoupon[]) => {
      let discountAmount = 0;

      // 퍼센트 할인 쿠폰 처리
      const percentCoupons = coupons.filter(
        (coupon): coupon is PercentIssuedCoupon => coupon.type === 'percentDiscount'
      );
      if (percentCoupons.length > 0) {
        const bestCoupon = percentCoupons.reduce((a, b) =>
          a.discountRate > b.discountRate ? a : b
        );

        const calculatedDiscount = (cartTotal.value * bestCoupon.discountRate) / 100;

        bestCoupon.usedAmount = Math.floor(calculatedDiscount); // ✅ 실사용 금액을 usedAmount에 기록
        discountAmount += bestCoupon.usedAmount; // ✅ 기록된 usedAmount를 할인 합계에 반영
      }

      // 고정 금액 할인 쿠폰 처리
      const fixedCoupons = coupons.filter(
        (coupon): coupon is FixedAmountIssuedCoupon => coupon.type === 'fixedAmountDiscount'
      );
      fixedCoupons.forEach(coupon => {
        coupon.usedAmount = coupon.discountAmount; // ✅ 고정 할인은 discountAmount를 usedAmount에 기록
        discountAmount += coupon.usedAmount;        // ✅ recorded usedAmount를 할인 합계에 반영
      });

      return discountAmount;
    };

  

  // ✅ 쿠폰 선택 가능 여부
  function canUseCoupon(coupon: IssuedCoupon): boolean {
    // 이미 선택된 쿠폰은 항상 활성화 (해제 용)
    if (selectedCoupons.value.some(c => c.id === coupon.id)) return true

    // % 쿠폰은 하나만 사용 가능
    if (
      coupon.type === 'percentDiscount' &&
      selectedCoupons.value.some(c => c.type === 'percentDiscount')
    ) {
      return false
    }

    const newSelectedCoupons = [...selectedCoupons.value, coupon]
    const newTotal = calculateTotalWithCoupons(newSelectedCoupons)

    return newTotal >= 0
  }

  // ✅ 사용 가능한 쿠폰 목록
  const usableCoupons = computed(() =>
    availableCoupons.value.filter(canUseCoupon)
  )

  return {
    calculateCouponDiscountForSelected,
    usableCoupons,
  }
})
