// 📁 shared-types/coupon/issuedCoupon.ts
import type { Timestamp } from "@/shared/firebase/firebaseTypes";
import { type Channel } from "./couponDefinition";
import type { CouponDefinition } from "./couponDefinition";


export type CouponUsageLog = {
  type: 'requested' | 'approved' | 'cancelled' | 'used'
  by: string          // 사용자 또는 관리자 ID
  dateLogged: Timestamp
  note?: string       // (선택) 메모, 주문 ID, 사유 등
}



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
  uid: string;                    // 사용자 고유 ID
  couponDefinitionId: string;     // 원본 쿠폰 정의 ID
  couponName: string;             // 쿠폰 이름
  eventName: string;              // 이벤트 이름
  status: 'active' | 'used' | 'expired' | 'requested' | 'cancelled'
  issuingCompanyId: string;       // 발급 회사 ID
  whereToUse: Channel;            // 사용 가능한 채널
  couponUsage: CouponUsage[];     // 사용 기록
  availableCompanyIds?: string[];
  availableBrandNames?: string[];
  availableProductIds?: string[];
  availableCategoryIds?: string[];
  usageLog: CouponUsageLog[]

  memo?: string;
  dateIssuedyyyy: number;
  dateIssuedyyyyMM: number;
  dateIssuedyyyyMMdd: number;
  dateIssued: Timestamp;
  dateExpiration: Timestamp | null;
}

/**
 * 퍼센트 할인 발행 쿠폰
 */
export interface PercentIssuedCoupon extends BaseIssuedCoupon {
  type: 'percentDiscount';
  discountRate: number;
  discountMaxAmount?: number;
  usedAmount: number; // ✅ 실제 주문에서 사용된 금액
}

/**
 * 고정 금액 할인 발행 쿠폰
 */
export interface FixedAmountIssuedCoupon extends BaseIssuedCoupon {
  type: 'fixedAmountDiscount';
  discountAmount: number; // ✅ 고정 할인 금액
  usedAmount: number;     // ✅ 실제 주문에서 사용된 금액
  isPossibleSave: boolean;
}

/**
 * 무료 아이템 발행 쿠폰
 */
export interface FreeItemIssuedCoupon extends BaseIssuedCoupon {
  type: 'freeItem';
  usedAmount: number; // ✅ 향후 사용시 대비해 추가 (지금은 기본 0)
}

export type IssuedCoupon =
  | PercentIssuedCoupon
  | FixedAmountIssuedCoupon
  | FreeItemIssuedCoupon;

/**
 * 발급 쿠폰 기본 생성 함수
 */
export function createIssuedCoupon(
  def: CouponDefinition,
  companyId: string,
  uid: string,
  issuedAt: Timestamp
): IssuedCoupon {
  const date = new Date(issuedAt.toDate());
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
    usageLog: [],
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
        ...(def.discountMaxAmount !== undefined && { discountMaxAmount: def.discountMaxAmount }),
        usedAmount: 0, // ✅ 초기값 0
      };
    case 'fixedAmountDiscount':
      return {
        ...base,
        type: 'fixedAmountDiscount',
        discountAmount: def.discountAmount,
        usedAmount: 0, // ✅ 초기값 0
        isPossibleSave: def.isPossibleSave,
      };
    case 'freeItem':
      return {
        ...base,
        type: 'freeItem',
        usedAmount: 0, // ✅ 초기값 0
      };
  }
}

/**
 * 발행 쿠폰 ID 자동 생성기
 */
function generateIssuedId(): string {
  const ts = Date.now().toString();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `iss_${ts}_${rand}`;
}
