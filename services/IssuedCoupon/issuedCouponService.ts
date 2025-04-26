import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import type { IssuedCoupon } from '@/shared-types/coupon/issuedCoupon'

export function createUserIssuedCouponService() {
  const db = getFirestore()

  return {
    /**
     * 현재 로그인한 사용자의 발급된 쿠폰 전체 조회
     * @param uid 사용자 UID
     */
    async getMyCoupons(uid: string): Promise<IssuedCoupon[]> {
      const q = query(collection(db, 'issuedCoupon'), where('uid', '==', uid))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => {
        const { id: _ignored, ...rest } = doc.data() as IssuedCoupon
        return {
          id: doc.id,
          ...rest,
        }
      })
    },

    /**
     * 현재 로그인한 사용자의 수정된 쿠폰 조회 (since 이후 변경된 것만)
     * @param uid 사용자 UID
     * @param since 타임스탬프 (number)
     */
    async getMyModifiedCoupons(uid: string, since: number): Promise<IssuedCoupon[]> {
        try {
          const q = query(
            collection(db, 'v2_couponIssued'),
            where('uid', '==', uid),
            where('dateIssued', '>=', new Date(since))
          )
          const snapshot = await getDocs(q)
          return snapshot.docs.map(doc => {
            const { id: _ignored, ...rest } = doc.data() as IssuedCoupon
            return {
              id: doc.id,
              ...rest,
            }
          })
        } catch (error) {
          console.error('❌ [쿠폰 가져오기 실패]', error)
          return [] // 에러 발생 시 빈 배열 반환
        }
      }
  }      
}
