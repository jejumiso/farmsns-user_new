// 📁 stores/order/useOrderSummaryStore.ts
import { defineStore } from 'pinia'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import { useCartStore } from '@/stores/cart/useCartStore'
import { useCompanyStore } from '@/stores/company/useCompanyStore'
import type { OrderSummary } from '@/shared-types/order/orderSummary'
import type { IssuedCoupon } from '~/shared-types/coupon/issuedCoupon'
import { haversine } from '~/utils/haversine'
import type { PaymentMethod, SelectedMethod } from '~/shared-types/order/orderTypes'



export const useOrderSummaryStore = defineStore('orderSummary', {
  persist: false, 
  state: () => ({
    orderSummary: {
      selectedCoupons: [], // 선택된 쿠폰들
      paymentMethod: 'onsite' as PaymentMethod, // 결제 방법
      usedPoint: 0, // 사용된 포인트
      selectedMethod: 'takeout' as SelectedMethod, // 주문 방법 (포장, 매장, 배달)
      selectedAddress: undefined, // 배송지
      distance: null, // 배송지와 가게의 거리
      deliveryFee: 0, // 배송비
      customerMemo : '', // 고객 메모
    } as OrderSummary,
  }),

  getters: {
    cartItems: () => useCartStore().items, // useCartStore에서 items를 참조
    cartTotal: () => useCartStore().cartTotalBase, // useCartStore에서 cartTotal을 참조
  },

  actions: {
    resetOrderSummary() {
      this.orderSummary = {
        selectedCoupons: [],
        paymentMethod: 'onsite',
        usedPoint: 0,
        selectedMethod: 'takeout',
        selectedAddress: undefined,
        distance: null,
        deliveryFee: 0,
        customerMemo: '',
      }
    },

    // OrderSummary 객체를 스토어에 세팅
    setOrderSummary(orderData: OrderSummary) {
      this.orderSummary = orderData
    },

    // 주문 요약에 일부 데이터를 업데이트
    updateOrderSummary(updatedData: Partial<OrderSummary>) {
      this.orderSummary = { ...this.orderSummary, ...updatedData }
    },

    // 배송지 업데이트 (자동으로 계산되도록)
    updateSelectedAddress() {
      const userStore = useUserAuthStore()
      const list = userStore.customerProfile?.deliveryAddressList ?? []
      const defId = userStore.customerProfile?.defaultDeliveryAddressId ?? null
    
      // 주문 방식이 'delivery'가 아니라면 무조건 초기화
      if (this.orderSummary.selectedMethod !== 'delivery') {
        this.orderSummary.selectedAddress = undefined
        this.orderSummary.distance = null
        this.orderSummary.deliveryFee = 0
        return
      }
    
      // 리스트가 없거나 기본 배송지가 없으면 초기화
      if (!list.length || !defId) {
        this.orderSummary.selectedAddress = undefined
        this.orderSummary.distance = null
        this.orderSummary.deliveryFee = 0
        return
      }
    
      // 기본 배송지 세팅 후 거리/배송비 계산
      this.orderSummary.selectedAddress = list.find(a => a.id === defId) ?? list[0]
      this.updateDistanceAndDeliveryFee()
    },

    // 배송지와 거리 계산 후 배송비 업데이트
    updateDistanceAndDeliveryFee() {
      const selectedAddress = this.orderSummary.selectedAddress
      const companyGeoPoint = useCompanyStore().currentCompany?.businessInfo.geoPoint
      console.log(JSON.stringify(useCompanyStore().currentCompany?.businessInfo))
    
      console.log('📦 [거리계산] selectedAddress:', selectedAddress)
      console.log('🏢 [거리계산] companyGeoPoint:', companyGeoPoint)
    
      if (!selectedAddress || !selectedAddress.geoPoint || !companyGeoPoint) {
        console.warn('⚠️ 거리계산 불가: 배송지나 매장 위치 정보 누락')
        this.orderSummary.distance = null
        this.orderSummary.deliveryFee = 0
        return
      }
    
      const distance = haversine(
        [companyGeoPoint.latitude, companyGeoPoint.longitude],
        [selectedAddress.geoPoint.latitude, selectedAddress.geoPoint.longitude]
      )
      
      this.orderSummary.distance = distance
      console.log(`📏 [거리계산] 거리: ${(distance as number).toFixed(2)}m`)
    
      this.orderSummary.distance = distance
      this.updateDeliveryFee()
    },
    

    // 배송비 계산
    updateDeliveryFee() {
      const deliveryConfig = useCompanyStore().currentCompany?.deliveryConfig
      const selectedAddress = this.orderSummary.selectedAddress
      const distance = this.orderSummary.distance
      const cartItems = useCartStore().items

      if (!deliveryConfig) {
        this.orderSummary.deliveryFee = 0
        return
      }

      if (deliveryConfig.type === 'quick') {
        if (!selectedAddress || distance === null) {
          this.orderSummary.deliveryFee = 0
          return
        }

        const { baseDistance, baseFee, additionalDistance, additionalFee } = deliveryConfig

        if (distance <= baseDistance) {
          this.orderSummary.deliveryFee = baseFee
        } else {
          const extraDistance = Math.ceil((distance - baseDistance) / additionalDistance)
          const extraFee = extraDistance * additionalFee
          this.orderSummary.deliveryFee = baseFee + extraFee
        }
      } else if (deliveryConfig.type === 'parcel') {
        const totalBundleValue = cartItems.reduce((sum, item) => {
          const value = item.parcelBundleValue ?? 1
          return sum + value * item.quantity
        }, 0)

        const bundleCount = Math.ceil(totalBundleValue / deliveryConfig.bundleUnit)
        this.orderSummary.deliveryFee = bundleCount * deliveryConfig.baseFee
      } else {
        this.orderSummary.deliveryFee = 0
      }
    },




    // 주문 방법 변경 시 자동으로 배송비 업데이트
    updateSelectedMethod(method: SelectedMethod) {
      this.orderSummary.selectedMethod = method
      if (method !== 'delivery') {
        this.orderSummary.deliveryFee = 0
        this.orderSummary.distance = null
      } else {
        this.updateDistanceAndDeliveryFee()
      }
    },
    updateSelectedCoupons(coupons: IssuedCoupon[]) {
      this.orderSummary.selectedCoupons = coupons
    },

    // 리워드 제외 로직을 처리
    applyRewardExclusion(selectedCouponIds: IssuedCoupon[]) {
      const cartStore = useCartStore()
      cartStore.applyRewardExclusion(selectedCouponIds) // useCartStore의 applyRewardExclusion 호출
    },
  },
})
