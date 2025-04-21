import { Timestamp } from '@/shared/firebase/firebaseTypes'

/**
 * 쿠폰 사용 로그
 */
export interface CouponUseLog {
  orderId: string           // 어떤 주문에서 사용했는지
  usedPoint: number         // 사용한 포인트
  dateUsed: Timestamp       // 사용 시각
}

/**
 * 쿠폰 데이터
 */
export interface Coupon {
  id: string                // 쿠폰 ID
  name: string              // 쿠폰 이름
  description?: string      // 설명 (선택)
  pointTotal: number        // 발행된 총 포인트
  pointRemaining: number    // 남아있는 포인트
  discountRate?: number     // 퍼센트 할인 (선택)
  discountMaxPoint?: number // 최대 할인 금액 (선택)
  isPossibleSave: boolean   // 잔여 포인트 보관 가능 여부
  isOnlyWebOrder?: boolean  // 웹 주문에서만 사용 가능 여부

  // 사용 조건
  availableProductIds?: string[]     // 특정 상품 ID만 사용 가능
  availableCategoryIds?: string[]    // 특정 카테고리만 사용 가능
  availableOrderMethods?: ('takeout' | 'dinein' | 'delivery')[] // 사용 가능한 주문 방식

  // 발행처 정보
  issuedByCompanyId: string
  issuedByBrandName?: string
  issuedByPlatform?: boolean // 플랫폼에서 발행했는지 여부

  // 유효 기간
  dateCreated: Timestamp
  dateExpiration: Timestamp | null

  // 사용 내역
  useLogs: CouponUseLog[]
}
