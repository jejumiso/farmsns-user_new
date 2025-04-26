import { defineStore } from 'pinia'
import type { IssuedCoupon } from '@/shared-types/coupon/issuedCoupon'
import { createUserIssuedCouponService } from '~/services/IssuedCoupon/issuedCouponService'

export const useCouponStore = defineStore('couponStore', {
  state: () => ({
    coupons: [] as IssuedCoupon[],
    loading: false,
    lastFetchedAt: 0 as number, // 마지막 가져온 시간 (timestamp)
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
      } finally {
        this.loading = false
      }
    },
    

    mergeCoupons(updatedCoupons: IssuedCoupon[]) {
      const map = new Map(this.coupons.map(coupon => [coupon.id, coupon]))
      for (const updated of updatedCoupons) {
        map.set(updated.id, updated)
      }
      this.coupons = Array.from(map.values())
    },

    clearCoupons() {
      this.coupons = []
      this.lastFetchedAt = 0
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