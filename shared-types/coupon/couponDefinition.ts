import  { Timestamp } from "@/shared/firebase/firebaseTypes"

export interface CouponDefinition {
  id: string // 쿠폰 ID
  idCompanyByPublisher: string // 쿠폰 발행 회사 ID

  nameCoupon: string // 쿠폰 이름
  nameEvent: string // 이벤트 이름
  type: 'percentDiscount' | 'fixedAmountDiscount' | 'freeItem' // 쿠폰 종류

  requiredStamps: number // 쿠폰 발급을 위한 필요한 스템프 (예: 10 스템프)

  discountRate?: number // 할인율 (예: 10% 할인) - `type: 'percentDiscount'`일 때 사용
  discountMaxAmount?: number // 최대 할인 금액 (예: 500원까지 할인) - `type: 'discountRate'`일 때 사용
  discountAmount?: number // 금액 할인 (예: 10000원 할인) - `type: 'fixedAmountDiscount'`일 때 사용
  

  availableProductIds: string[] // 쿠폰이 적용될 상품 (필요시) 
  availableCategoryIds : string[] // 쿠폰이 적용될 카테고리 (필요시) 
  
  
  // 기타 관련 필드
  isPossibleSave: boolean // 쿠폰을 분할해서 사용할 수 있는지 여부 - `type : 'fixedAmountDiscount`일 때 사용용

  qty: number // 발행 가능한 쿠폰 수 : -1이면 무제한 0이면 발행불가 1이상이면 선착순 소진될때까지
  whereToUse: '' | 'web' | 'offline' // 사용 가능한 장소 (예: 'app', 'website')

  
  dateExpiration: Timestamp | null // 쿠폰 만료 날짜 : 
  validForDays: number // 쿠폰이 발급된 날로부터 유효한 일수 (예: 300일 후 만료) -1이면 무한한

  dateCreated: Timestamp // 쿠폰 조건 생성 날짜
  dateModified: Timestamp // 쿠폰 조건 수정 날짜


  memo?: string // 쿠폰 관련 메모
}


// ✅ 기본값 생성 함수
export function createEmptyCouponDefinition(): CouponDefinition {
  return {
    id: '', // 쿠폰 ID (기본값 빈 문자열)
    idCompanyByPublisher: '', // 발행 회사 ID (기본값 빈 문자열)
    nameCoupon: '쿠폰 이름', // 쿠폰 이름 기본값
    nameEvent: '이벤트 이름', // 이벤트 이름 기본값
    type: 'fixedAmountDiscount', // 쿠폰 종류 기본값 (percentDiscount)
    requiredStamps: 10, // 필요한 스템프 기본값
    discountRate: 10, // 할인율 기본값
    discountMaxAmount: 500, // 최대 할인 금액 기본값
    discountAmount: 0, // 금액 할인 기본값
    availableProductIds: [], // 적용 가능한 상품 기본값
    availableCategoryIds: [], // 적용 가능한 카테고리 기본값
    isPossibleSave: true, // 쿠폰 분할 사용 가능 여부 기본값
    qty: 100, // 발행 가능한 쿠폰 수 기본값
    whereToUse: 'web', // 사용 가능한 장소 기본값
    dateExpiration: null, // 만료 날짜 기본값
    validForDays: -1, // 유효 기간 기본값
    dateCreated: Timestamp.now(), // 생성 날짜 (현재 시각)
    dateModified: Timestamp.now(), // 수정 날짜 (현재 시각)
    memo: '쿠폰 관련 메모', // 메모 기본값
  };
}