import { defineStore } from 'pinia'
import type { IssuedCoupon } from '@/shared-types/coupon/issuedCoupon'
import { createUserIssuedCouponService } from '~/services/IssuedCoupon/issuedCouponService'

export const useCouponStore = defineStore('couponStore', {
  state: () => ({
    coupons: [] as IssuedCoupon[],
    loading: false,
    lastFetchedAt: null as number | null, // 마지막 가져온 시간 (timestamp)
    errorMessage: '' as string, // state 추가

  }),

  getters: {
    availableCoupons: (state) =>
      state.coupons.filter(coupon => coupon.status === 'active'),

    usedCoupons: (state) =>
      state.coupons.filter(coupon => coupon.status === 'used'),

    expiredCoupons: (state) =>
      state.coupons.filter(coupon => coupon.status === 'expired'),

    couponCount: (state) => state.coupons.length,
  },

  actions: {
    // async fetchMyCoupons(uid: string) {
    //   this.loading = true
    //   try {
    //     const service = createUserIssuedCouponService()
    //     this.coupons = await service.getMyCoupons(uid)
    //     this.lastFetchedAt = Date.now()
    //   } catch (error) {
    //     console.error('쿠폰 가져오기 실패:', error)
    //   } finally {
    //     this.loading = false
    //   }
    // },

    async fetchMyModifiedCoupons(uid: string) {
      console.log('[fetchMyModifiedCoupons] 호출됨, uid:', uid)
      this.loading = true
      try {
        const service = createUserIssuedCouponService()
        const updatedCoupons = await service.getMyModifiedCoupons(uid, this.lastFetchedAt || 0)
        console.log('[fetchMyModifiedCoupons] 가져온 쿠폰 수:', updatedCoupons.length)
        this.mergeCoupons(updatedCoupons)
        this.lastFetchedAt = Date.now()
      } catch (error) {
        console.error('[fetchMyModifiedCoupons] 쿠폰 가져오기 실패:', error)
        this.errorMessage = '쿠폰 가져오기 실패: ' + error
      } finally {
        this.loading = false
      }
    },
    

    mergeCoupons(updatedCoupons: IssuedCoupon[]) {
      const updatedMap = new Map<string, IssuedCoupon>();

    
      // 기존 쿠폰 배열에서 ID를 기준으로 업데이트된 쿠폰만 넣기
      updatedCoupons.forEach(coupon => {
        updatedMap.set(coupon.id, coupon);
      });
    
      // 기존 coupons 배열에서 ID를 기준으로 최신 쿠폰으로 병합
      this.coupons.forEach(coupon => {
        updatedMap.set(coupon.id, coupon);
      });
    
      // 업데이트된 쿠폰만 포함된 배열로 설정
      this.coupons = Array.from(updatedMap.values());
    },
    

    clearCoupons() {
      this.coupons = []
      this.lastFetchedAt = null;
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'couponStore',
        storage: localStorage,
        paths: ['coupons', 'lastFetchedAt'],
      },
    ],
  },
})