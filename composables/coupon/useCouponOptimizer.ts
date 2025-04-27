import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart/useCartStore'
import { useCouponStore } from '@/stores/coupon/useCouponStore'
import { useOrderViewStore } from '@/stores/view/order/useOrderViewStore'
import type {
  IssuedCoupon,
  PercentIssuedCoupon,
  FixedAmountIssuedCoupon
} from '@/shared-types/coupon/issuedCoupon'

export const useCouponOptimizer = defineStore('couponOptimizer', () => {
  const couponStore = useCouponStore() // 쿠폰 스토어 사용
  const cartStore = useCartStore()
  const orderViewStore = useOrderViewStore() 

  const selectedCoupons = computed(() => orderViewStore.selectedCoupons)

  // 고객이 보유한 쿠폰
  const availableCoupons = computed(() => couponStore.availableCoupons)

  const cartTotal = computed(() => cartStore.cartTotal)

  // 장바구니 총액에서 쿠폰 할인 금액을 뺀 최종 금액 계산
  const calculateTotalWithCoupons  = (coupons: IssuedCoupon[]) => {
    const discount = calculateCouponDiscount(coupons); // 할인 금액 계산
    const subtotal = cartTotal.value - discount;
    return subtotal;
  }

  // 실제 선택된 쿠폰으로 할인 금액 계산
  const calculateCouponDiscountForSelected = () => {
    return calculateCouponDiscount(selectedCoupons.value); // 선택된 쿠폰으로 할인 금액 계산
  }

  // 주어진 쿠폰 배열로 할인 금액 계산 (외부에서 제공되는 배열)
  const calculateCouponDiscount = (coupons: IssuedCoupon[]) => {
    let discountAmount = 0;
    
    // % 할인 쿠폰 처리
    const percentCoupons = coupons.filter(
      (coupon): coupon is PercentIssuedCoupon => coupon.type === 'percentDiscount'
    );
    if (percentCoupons.length > 0) {
      const bestCoupon = percentCoupons.reduce((a, b) =>
        a.discountRate > b.discountRate ? a : b
      );
      discountAmount += (cartTotal.value * bestCoupon.discountRate) / 100;
    }
  
    // 고정 금액 할인 쿠폰 처리
    const fixedCoupons = coupons.filter(
      (coupon): coupon is FixedAmountIssuedCoupon => coupon.type === 'fixedAmountDiscount'
    );
    fixedCoupons.forEach(coupon => {
      discountAmount += coupon.discountAmount;
    });
  
    return discountAmount;
  }

  function canUseCoupon(coupon: IssuedCoupon): boolean {
    // 이미 골라진 쿠폰은 항상 '취소' 용도로 활성화
    if (selectedCoupons.value.some(c => c.id === coupon.id)) return true
  
    // %쿠폰은 한번만 선택 가능
    if (
      coupon.type === 'percentDiscount' &&
      selectedCoupons.value.some(c => c.type === 'percentDiscount')
    ) {
      return false
    }
  
    // 실제로 이 쿠폰을 추가했을 때 최종 합계가 0 이상인지 계산
    const newSelectedCoupons = [...selectedCoupons.value, coupon]; // 추가된 상태의 쿠폰 배열
    const newTotal = calculateTotalWithCoupons (newSelectedCoupons); // 새로운 배열로 최종 금액 계산
    return newTotal >= 0;
  }

  // 사용 가능한 쿠폰 목록
  const usableCoupons = computed(() =>
    availableCoupons.value.filter(canUseCoupon)  // canUseCoupon을 사용해 필터링
  )

  return {
    calculateCouponDiscountForSelected, // 선택된 쿠폰으로 할인 계산
    usableCoupons,
  }
})
