import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import type { CustomerCompanyActivity } from '@/shared-types/customer-company-activity/customerCompanyActivity'
import type { CustomerProfile } from '~/shared-types/customer-profile/customerProfile'
import { getAuth, signOut } from 'firebase/auth'
import { decryptWithIv } from '~/shared-utils/crypto/decryption'
import { createAuthService } from '~/services/auth/authService'
import { stopCompanyRealtimeWatcher } from '~/utils/watchCompanyRealtime'
import { useCartStore } from '~/stores/cart/useCartStore'
import { createCustomerProfileService } from '@/services/customer/customerProfileService'
import { createTabletSettingsService } from '~/services/customer-company-activity/customerCompanyActivity'
import { useCouponStore } from '../coupon/useCouponStore'
import { useOrderViewStore } from '../view/order/useOrderViewStore'

export const useUserAuthStore = defineStore('userAuth', {
  state: () => ({
    currentUser: null as User | null,
    customerProfile: null as CustomerProfile | null,
    customerCompanyActivity: null as CustomerCompanyActivity | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    customerName: (state) =>
      state.customerProfile && state.customerProfile.securedUserName && state.customerProfile.iv
        ? decryptWithIv(state.customerProfile.securedUserName, state.customerProfile.iv)
        : 'x',
    customerStampCount: (state) => state.customerCompanyActivity?.stampCount ?? 0,
  },

  actions: {
    setUser(user: {
      customerProfile: CustomerProfile
      customerCompanyActivity?: CustomerCompanyActivity | null
    }) {
      this.customerProfile = user.customerProfile
      this.customerCompanyActivity = user.customerCompanyActivity ?? null
    },

    setFirebaseUser(user: User) {
      this.currentUser = user
    },

    async syncCustomerProfile(uid: string) {
      try {
        const customerRes = await createCustomerProfileService('guest').getById('',uid)
        const customer = customerRes.data as CustomerProfile
        if (customer) {
          this.customerProfile = customer
        }
      } catch (error) {
        console.error('[userAuthStore] 고객 프로필 동기화 실패:', error)
      }
    },

    async syncCustomerCompanyActivity(uid: string) {
      try {
        const activityRes = await createTabletSettingsService('guest').getById(uid)
        const activity = activityRes.data as CustomerCompanyActivity
        if (activity) {
          this.customerCompanyActivity = activity
        }
      } catch (error) {
        console.error('[userAuthStore] 고객 활동 정보 동기화 실패:', error)
      }
    },

    async initializeAuth() {
      const auth = getAuth()
      auth.onAuthStateChanged(async (firebaseUser) => {
        this.currentUser = firebaseUser
        const cartStore = useCartStore()

        if (firebaseUser) {
          console.log('Firebase Auth 상태 변경:', firebaseUser)
          const couponStore = useCouponStore()
          await couponStore.fetchMyModifiedCoupons(firebaseUser.uid)
          // await this.syncCustomerProfile(firebaseUser.uid)
          // await this.syncCustomerCompanyActivity(firebaseUser.uid)
        } else {
          this.currentUser = null
          this.customerProfile = null
          this.customerCompanyActivity = null
          stopCompanyRealtimeWatcher()
          cartStore.clearCart()
        }
      })
    },

    logout() {
      const auth = getAuth()
      const cartStore = useCartStore()

      const couponStore = useCouponStore()
      couponStore.clearCoupons()

      const orderView = useOrderViewStore()
      orderView.reset()

      signOut(auth)
        .then(() => console.log('[userAuthStore] Firebase 로그아웃 완료'))
        .catch((error) => console.error('[userAuthStore] Firebase 로그아웃 실패:', error))

      this.currentUser = null
      this.customerProfile = null
      this.customerCompanyActivity = null
      cartStore.clearCart()
      console.log('[userAuthStore] 로그아웃 완료 및 장바구니 초기화')
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'userAuth',
        storage: localStorage,
        paths: ['currentUser', 'customerProfile', 'customerCompanyActivity'],
      },
    ],
  },
})