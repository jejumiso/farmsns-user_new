import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart/useCartStore'
import type { IssuedCoupon, PercentIssuedCoupon, FixedAmountIssuedCoupon } from '@/shared-types/coupon/issuedCoupon'

export const useCouponOptimizer = defineStore('couponOptimizer', () => {
  const cartStore = useCartStore()
  const selectedCouponIds = ref<string[]>([])
  const availableCoupons = ref<IssuedCoupon[]>([])

  const cartTotal = computed(() =>
    cartStore.items.reduce((sum, item) => sum + item.priceDiscounted * item.quantity, 0)
  )

  function calculateSubtotalWithCoupons(customSelectedCouponIds?: string[]) {
    let subtotal = cartTotal.value
    const selected = (customSelectedCouponIds ?? selectedCouponIds.value)
      .map(id => availableCoupons.value.find(c => c.id === id))
      .filter(Boolean) as IssuedCoupon[]

    // 퍼센트 할인 먼저 적용
    const percentCoupons = selected.filter(c => c.type === 'percentDiscount') as PercentIssuedCoupon[]
    if (percentCoupons.length) {
      const bestPercentCoupon = percentCoupons.sort((a, b) => b.discountRate - a.discountRate)[0]
      subtotal = Math.floor(subtotal * (1 - bestPercentCoupon.discountRate / 100))
    }

    // 금액 할인 적용
    const fixedCoupons = selected.filter(c => c.type === 'fixedAmountDiscount') as FixedAmountIssuedCoupon[]
    for (const coupon of fixedCoupons) {
      subtotal = Math.max(0, subtotal - coupon.discountAmount)
    }

    return subtotal
  }

  function canUseCoupon(coupon: IssuedCoupon) {
    const selectedCoupons = selectedCouponIds.value.map(id => availableCoupons.value.find(c => c.id === id)).filter(Boolean) as IssuedCoupon[]
    const hasPercentCouponSelected = selectedCoupons.some(c => c.type === 'percentDiscount')
    const subtotalWithoutThisCoupon = calculateSubtotalWithCoupons()
  
    const isAlreadySelected = selectedCouponIds.value.includes(coupon.id)
  
    if (isAlreadySelected) {
      return true
    }
  
    if (subtotalWithoutThisCoupon <= 0) {
      return false
    }
  
    if (coupon.type === 'percentDiscount') {
      if (hasPercentCouponSelected) {
        return false
      }
    
      const originalSubtotal = cartTotal.value // 쿠폰 적용 전 전체 상품 합계
    
      // 퍼센트 할인 금액 계산
      const discountAmount = originalSubtotal * (coupon.discountRate / 100)
      const subtotalAfterPercent = originalSubtotal - discountAmount
    
      // 현재 선택된 금액 할인권들 적용
      const fixedAmountCoupons = selectedCouponIds.value
        .map(id => availableCoupons.value.find(c => c.id === id))
        .filter((c): c is FixedAmountIssuedCoupon => !!c && c.type === 'fixedAmountDiscount')
    
      let finalSubtotal = subtotalAfterPercent
      for (const fixedCoupon of fixedAmountCoupons) {
        finalSubtotal -= fixedCoupon.discountAmount
      }
    
      // 최종 결제금액이 0 이상이어야 퍼센트 쿠폰 선택 가능
      return finalSubtotal >= 0
    }
    
    
    
    
  
    if (coupon.type === 'fixedAmountDiscount') {
      if (coupon.discountAmount > subtotalWithoutThisCoupon) {
        return false
      }
      return true
    }
  
    return true
  }
  
  
  
  

  const usableCouponIds = computed(() => {
    return availableCoupons.value
      .filter(coupon => canUseCoupon(coupon))
      .map(coupon => coupon.id)
  })

  function toggleCoupon(couponId: string) {
    const index = selectedCouponIds.value.indexOf(couponId)
    if (index === -1) {
      selectedCouponIds.value.push(couponId)
    } else {
      selectedCouponIds.value.splice(index, 1)
    }
    // ✅ 쿠폰 토글할 때마다 리워드 제외 계산 적용
    cartStore.applyRewardExclusion(selectedCouponIds.value, availableCoupons.value)
  }

  function reset() {
    selectedCouponIds.value = []
  }

  return {
    availableCoupons,
    selectedCouponIds,
    usableCouponIds,
    toggleCoupon,
    reset,
    calculateSubtotalWithCoupons,
    canUseCoupon,
  }
})
