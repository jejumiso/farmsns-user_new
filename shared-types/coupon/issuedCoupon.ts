
// issuedCoupon.ts
import type { Timestamp } from "@/shared/firebase/firebaseTypes";
import { type Channel } from "./couponDefinition";
import type { CouponDefinition } from "./couponDefinition";

/**
 * 쿠폰 사용 내역
 */
export type CouponUsage = {
  companyId: string;
  orderId: string;
  usedAmount: number;
};

/**
 * 발행된 쿠폰의 공통 속성
 */
interface BaseIssuedCoupon {
  id: string;                     // 발행된 쿠폰 ID
  uid: string;                    // 발급된 쿠폰의 고유 ID
  couponDefinitionId: string;     // 원본 쿠폰 정의 ID
  couponName: string;             // 쿠폰 이름
  eventName: string;              // 이벤트 이름
  status: 'active' | 'used' | 'expired';
  issuingCompanyId: string;       // 발급 회사 ID
  whereToUse: Channel;            // 'all'일 때 모든 채널 사용 가능
  couponUsage: CouponUsage[];     // 사용된 주문 내역
  availableCompanyIds?: string[]; // 비어 있으면 모든 회사 사용 가능
  availableBrandNames?: string[]; // 비어 있으면 모든 브랜드 사용 가능
  availableProductIds?: string[]; // 필요 시에만
  availableCategoryIds?: string[];// 필요 시에만
  memo?: string;                  // 쿠폰 관련 메모
  dateIssuedyyyy: number,
  dateIssuedyyyyMM: number,
  dateIssuedyyyyMMdd: number,
  dateIssued: Timestamp;          // 발급 일시
  dateExpiration: Timestamp | null;// 만료 일시 (null이면 무기한)
}

/**
 * 퍼센트 할인 발행 쿠폰
 */
export interface PercentIssuedCoupon extends BaseIssuedCoupon {
  type: 'percentDiscount';
  discountRate: number;
  discountMaxAmount?: number;
}

/**
 * 금액 할인 발행 쿠폰
 */
export interface FixedAmountIssuedCoupon extends BaseIssuedCoupon {
  type: 'fixedAmountDiscount';
  discountAmount: number;
  isPossibleSave: boolean;
}

/**
 * 무료 아이템 발행 쿠폰
 */
export interface FreeItemIssuedCoupon extends BaseIssuedCoupon {
  type: 'freeItem';
}

export type IssuedCoupon =
  | PercentIssuedCoupon
  | FixedAmountIssuedCoupon
  | FreeItemIssuedCoupon;

/**
 * IssuedCoupon 기본 생성 팩토리
 * @param def - CouponDefinition
 * @param companyId - 발급 회사 ID
 * @param uid - 사용자 고유 ID
 * @param issuedAt - 발급 일시
 */
export function createIssuedCoupon(
  def: CouponDefinition,
  companyId: string,
  uid: string,
  issuedAt: Timestamp
): IssuedCoupon {

  const date = new Date(issuedAt.toDate()); // Firestore Timestamp → JS Date
  const yyyy = date.getFullYear();
  const yyyyMM = yyyy * 100 + (date.getMonth() + 1);
  const yyyyMMdd = yyyy * 10000 + (date.getMonth() + 1) * 100 + date.getDate();


  const base = {
    id: generateIssuedId(),
    uid,
    couponDefinitionId: def.id,
    couponName: def.couponName,
    eventName: def.eventName,
    status: 'active' as const,
    issuingCompanyId: companyId,
    whereToUse: def.whereToUse,
    couponUsage: [],
    availableCompanyIds: [],
    availableBrandNames: [],
    availableProductIds: def.availableProductIds,
    availableCategoryIds: def.availableCategoryIds,
    memo: def.memo,
    dateIssued: issuedAt,
    dateIssuedyyyy: yyyy,
    dateIssuedyyyyMM: yyyyMM,
    dateIssuedyyyyMMdd: yyyyMMdd,
    dateExpiration: def.dateExpiration ?? null,
  };

  switch (def.type) {
    case 'percentDiscount':
      return {
        ...base,
        type: 'percentDiscount',
        discountRate: def.discountRate,
        discountMaxAmount: def.discountMaxAmount,
      };
    case 'fixedAmountDiscount':
      return {
        ...base,
        type: 'fixedAmountDiscount',
        discountAmount: def.discountAmount,
        isPossibleSave: def.isPossibleSave,
      };
    case 'freeItem':
      return {
        ...base,
        type: 'freeItem',
      };
  }
}

/**
 * 발행 쿠폰 ID 자동 생성
 */
function generateIssuedId(): string {
  const ts = Date.now().toString();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `iss_${ts}_${rand}`;
}
