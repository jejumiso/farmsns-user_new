import type { Timestamp } from "@/shared/firebase/firebaseTypes";

export interface PointSave {
  /** 기본 정보 */
  id: string;                       // 고유 ID
  uid: string;                     // 사용자 ID (UID)
  companyId: string;               // 회사 ID
  orderId: string;                 // 주문 ID (있다면)
  adminUserId: string;             // 적립 처리한 관리자 ID /  혹은 테블릿 로그인한 관리자 ID

  /** 사용자 정보 */
  securedPhone: string;     // 암호화된 전화번호
  adminSecuredPhone: string;    // 관리자 전화번호 (암호화 or 원본)

  /** 적립 정보 */
  stamp: number;                  // 적립된 스탬프 수
  point: number;                  // 적립된 포인트 수
  stampRemaining: number;        // 적립 후 남은 스탬프
  pointRemaining: number;        // 적립 후 남은 포인트
  tabletNum: number;             // 적립이 일어난 태블릿 번호

  /** 적립 타입 구분 */
  rewardType: string;              // 예: '스템프적립'

  /** 메타 정보 */
  memo: string;

  /** 날짜 정보 */
  dateCreated: Timestamp;        // 생성일 (기준)
  dateModified: Timestamp;       // 수정일 (업데이트 기준)
  dateCreatedyyyy: number;
  dateCreatedyyyyMM: number;
  dateCreatedyyyyMMdd: number;
}
