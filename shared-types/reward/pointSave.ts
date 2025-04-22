import type { Timestamp } from "@/shared/firebase/firebaseTypes";

export interface PointSave {
  id: string;                         // 고유 ID
  phoneNumber: string;
  idUser: string;                     // 사용자 ID
  idCompany: string;                  // 회사 ID
  idOrder: string;                    // 주문 ID
  resUserPhoneNumber: string;        // 사용자 전화번호
  resAdminPhoneNumber: string;

  saveType: string;                  // 적립 유형 (ex: offline, webOrder 등)
  saveType2: string;                 // 추가 구분 (ex: 테블릿스템프적립 등)
  memo: string;

  stamp: number;                     // 적립된 스탬프 수
  point: number;

  stampRemaining: number;           // 남아 있는 스탬프 수
  pointRemaining: number;

  tabletNum: number;

  dateModified: Timestamp;           // 수정일
  dateCreated: Timestamp;            // 생성일 (기존 필드)
  dateCreate: Timestamp;             // 생성일 (중복일 수 있음 — 확인 필요)

  dateCreateyyyy: number;            // 메모용 날짜 필드
  dateCreateyyyyMM: number;
  dateCreateyyyyMMdd: number;

  adminUserId: string;
}
