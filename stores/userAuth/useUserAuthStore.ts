import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import type { CustomerCompanyActivity } from '@/shared-types/customer-company-activity/customerCompanyActivity'
import type { CustomerProfile } from '~/shared-types/customer-profile/customerProfile'
import { getAuth, signOut } from 'firebase/auth'
import { decryptWithIv } from '~/shared-utils/crypto/decryption'
import { createAuthService } from '~/services/auth/authService'
import { stopCompanyRealtimeWatcher } from '~/utils/watchCompanyRealtime'
import { useCartStore } from '~/stores/cart/useCartStore'

export const useUserAuthStore = defineStore('userAuth', {
  state: () => ({
    currentUser: null as User | null, // Firebase 인증 사용자
    customerProfile: null as CustomerProfile | null, // 고객 기본 정보
    customerCompanyActivity: null as CustomerCompanyActivity | null, // 고객의 매장 활동 정보
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

    async initializeAuth() {
      const auth = getAuth()
      auth.onAuthStateChanged(async (firebaseUser) => {
        this.currentUser = firebaseUser

        const cartStore = useCartStore()

        if (firebaseUser) {
          this.currentUser = firebaseUser
          try {
            // ✅ 고객 프로필 정보
            const customerRes = await createAuthService().getCustomerByUid(firebaseUser.uid)
            const customer = customerRes.data as CustomerProfile
            if (customer) {
              this.customerProfile = customer
            }

          } catch (error) {
            console.error('[userAuthStore] 초기화 실패:', error)
            this.currentUser = null
            this.customerProfile = null
            this.customerCompanyActivity = null
          }
        } else {
          this.currentUser = null
          this.customerProfile = null
          this.customerCompanyActivity = null
          stopCompanyRealtimeWatcher()
          // 🗑 장바구니 초기화
          cartStore.clearCart()
        }
      })
    },

    logout() {
      const auth = getAuth()
      const cartStore = useCartStore()

      signOut(auth)
        .then(() => {
          console.log('[userAuthStore] Firebase 로그아웃 완료')
        })
        .catch((error) => {
          console.error('[userAuthStore] Firebase 로그아웃 실패:', error)
        })

      this.currentUser = null
      this.customerProfile = null
      this.customerCompanyActivity = null
      // 🗑 장바구니 초기화
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
