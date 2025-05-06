import { defineStore } from 'pinia'
import type { IssuedCoupon } from '@/shared-types/coupon/issuedCoupon'
import { createUserIssuedCouponService } from '~/services/IssuedCoupon/issuedCouponService'
import { useUserAuthStore } from '../userAuth/useUserAuthStore'

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

    async fetchMyModifiedCoupons() {
      const userAuth = useUserAuthStore()

      const uid = userAuth.currentUser?.uid
      if (!uid) {
        console.error('[fetchMyModifiedCoupons] 사용자 정보가 없습니다.')
        this.errorMessage = '사용자 정보가 없습니다.'
        return
      }
      
      console.log('[fetchMyModifiedCoupons] 호출됨, uid:', uid)
      this.loading = true
      try {
        const service = createUserIssuedCouponService()
        const updatedCoupons = await service.getMyModifiedCoupons(uid, 0)  // ✅ 전체 가져오기
        console.log('[fetchMyModifiedCoupons] 가져온 쿠폰 수:', updatedCoupons.length)
    
        // 🎯 [임시 처리] status === 'active'인 쿠폰만 사용
        const activeCoupons = updatedCoupons.filter(coupon => coupon.status === 'active' || coupon.status === 'requested')
    
        console.log('[fetchMyModifiedCoupons] 사용 가능한 쿠폰 수:', activeCoupons.length)
    
        // ✅ 기존 쿠폰 초기화하고, 활성 쿠폰만 다시 세팅
        this.coupons = activeCoupons
    
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