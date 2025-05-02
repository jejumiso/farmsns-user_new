import type { Timestamp } from '@/shared/firebase/firebaseTypes'

export interface RewardLog {
  id: string            // 로그 ID
  uid: string           // 사용자 UID
  companyId: string     // 회사 ID
  orderId: string       // 주문 ID (없으면 ''로 설정)
  adminUserId: string   // 관리자 ID 또는 테블릿 관리자 ID
  securedPhone: string  // 고객 전화번호 (암호화)
  adminSecuredPhone: string // 관리자 전화번호 (암호화)

  stamp: number         // 적립된 스탬프 (양수, 없으면 0)
  usedStamp: number     // 사용된 스탬프 (양수, 없으면 0)
  point: number         // 적립된 포인트 (양수, 없으면 0)
  usedPoint: number     // 사용된 포인트 (양수, 없으면 0)

  stampRemaining: number  // 현재 보유 스탬프
  pointRemaining: number  // 현재 보유 포인트
  tabletNum: number       // 태블릿 번호 (웹은 0 등으로)

  rewardType: 'stampSave' | 'stampUse' | 'pointSave' | 'pointUse' | 'adjustment' // 보상 유형 (예: '스탬프적립', '포인트사용')
  source: 'order' | 'tablet' | 'admin' | 'system'  // 발생 출처 (예: 'order', 'tablet')
  memo: string            // 관리용 메모

  dateCreated: Timestamp
  dateModified: Timestamp
  dateCreatedyyyy: number
  dateCreatedyyyyMM: number
  dateCreatedyyyyMMdd: number
}
