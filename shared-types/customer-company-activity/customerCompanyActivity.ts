import { Timestamp } from "@/shared/firebase/firebaseTypes"

export interface CustomerCompanyActivity {
  id: string // uid

  // 스탬프 관련
  stampCount: number // 총 적립된 스탬프 횟수
  stampLast: number // 마지막으로 적립된 스탬프 수량
  stampRemaining: number // 현재 남아 있는 스탬프 수량
  stampTotal: number // 누적된 전체 스탬프 수

  // 포인트 관련
  pointCount: number // 총 적립된 포인트 횟수
  pointLast: number // 마지막 적립된 포인트 수량
  pointRemaining: number // 현재 남은 포인트
  pointTotal: number // 누적된 전체 포인트

  // 쿠폰 관련
 // TODO: 쿠폰 타입 지정 추천

  // 주문 관련
  shopPoint: number
  shopMoney: number
  orderTotalCount: number
  orderTotalPrice: number

  // 메타 정보
  dateModified: Timestamp
  dateCreated: Timestamp
}

export function createEmptyCustomerCompanyActivity(params: {
  id: string
}): CustomerCompanyActivity {
  const now = Timestamp.now()

  return {
    id: params.id,

    // 스탬프 관련
    stampCount: 0,
    stampLast: 0,
    stampRemaining: 0,
    stampTotal: 0,

    // 포인트 관련
    pointCount: 0,
    pointLast: 0,
    pointRemaining: 0,
    pointTotal: 0,

    // 쿠폰 관련

    // 주문 관련
    shopPoint: 0,
    shopMoney: 0,
    orderTotalCount: 0,
    orderTotalPrice: 0,

    // 메타 정보
    dateCreated: now,
    dateModified: now,
  }
}