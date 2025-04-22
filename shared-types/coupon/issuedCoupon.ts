import type { Timestamp } from "@/shared/firebase/firebaseTypes";

export interface IssuedCoupon {
  id: string // 발행된 쿠폰 ID
  couponDefinitionId: string // 쿠폰 정의 ID (CouponDefinition의 ID)
  userId: string // 쿠폰을 발급받은 사용자 ID
  

  type: 'percentDiscount' | 'fixedAmountDiscount' | 'freeItem' // 쿠폰 종류
  discountRate?: number // 할인율 (예: 10% 할인) - `type: 'percentDiscount'`일 때 사용
  discountMaxAmount?: number // 최대 할인 포인트 (예: 500원까지 할인) - `type: 'discountRate'`일 때 사용
  discountAmount?: number // 금액 할인 (예: 10000원 할인) - `type: 'fixedAmountDiscount'`일 때 사용
  isPossibleSave: boolean // 쿠폰을 분할해서 사용할 수 있는지 여부 - `type : 'fixedAmountDiscount`일 때 사용용
  productIds: string[] // 쿠폰이 적용될 상품 (필요시) 
  categoryIds : string[] // 쿠폰이 적용될 카테고리 (필요시) 
  whereToUse: '' | 'web' | 'offline' // 사용 가능한 장소 (예: 'app', 'website')

   // 쿠폰 사용 내역 관련 필드
   usedAmount: number; // 사용된 금액 (예: 5000원 사용)
   usageCount : number; // 사용된 횟수 (예: 2회 사용)
   couponUsage: { orderId: string; usedAmount: number }[]; // 사용된 주문 ID와 금액



  status: 'active' | 'used' | 'expired' // 쿠폰 상태
  issuingCompanyId: string; // 발급 회사 ID   
  availableCompanies?: string[]; // 이 쿠폰이 사용 가능한 회사들 비어있으면 사용 불가.
  availableBrandName?: string[]; // 이 쿠폰이 사용 가능한 브랜드들 비어있으면 availableCompanies에서 가능
  availableProductIds: string[] // 쿠폰이 적용될 상품 (필요시) 
  availableCategoryIds : string[] // 쿠폰이 적용될 카테고리 (필요시) 

  memo: string // 쿠폰 관련 메모 (예: "1만원 할인 쿠폰")

  dateIssued: Timestamp // 쿠폰 발급 날짜
  dateExpiration: Timestamp | null // 쿠폰 만료 날짜 (dateExpiration)
}
