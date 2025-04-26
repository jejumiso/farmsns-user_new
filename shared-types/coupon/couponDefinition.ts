// couponDefinition.ts

import { Timestamp } from "@/shared/firebase/firebaseTypes";

export type Channel = 'all' | 'web' | 'offline';
// 'all'이면 모든 채널 사용 가능

/**
 * 쿠폰 정의의 공통 속성
 */
export interface BaseCouponDefinition {
  id: string;                     // 쿠폰 정의 ID
  couponName: string;             // 쿠폰 이름
  eventName: string;              // 이벤트 이름
  stampsRequired: number;         // 스탬프 n개마다 쿠폰 1장 발행 (예: 10)
  maxIssueCount?: number;         // 최대 발행 가능 수 (-1: 무제한, 0: 발행불가, >0: 선착순)
  whereToUse: Channel;            // 사용 가능한 채널
  availableProductIds?: string[]; // 적용 대상 상품 ID (없으면 모든 상품)
  availableCategoryIds?: string[];// 적용 대상 카테고리 ID (없으면 모든 카테고리)
  dateCreated: Timestamp;         // 정의 생성 일시
  dateModified: Timestamp;        // 정의 수정 일시
  dateExpiration: Timestamp | null; // 만료 일시 (null이면 무기한)
  validForDays: number;          // 발급 후 유효 일수 (없으면 무제한)
  memo: string;                  // 추가 메모
}

/**
 * 퍼센트 할인 쿠폰 정의
 */
export interface PercentCouponDefinition extends BaseCouponDefinition {
  type: 'percentDiscount';
  discountRate: number;           // 할인율 (예: 10 => 10%)
  discountMaxAmount?: number;     // 최대 할인 금액 (예: 500원까지)
}

/**
 * 금액 할인 쿠폰 정의
 */
export interface FixedAmountCouponDefinition extends BaseCouponDefinition {
  type: 'fixedAmountDiscount';
  discountAmount: number;         // 고정 할인 금액 (예: 10000원)
  isPossibleSave: boolean;        // 분할 사용 가능 여부
}

/**
 * 무료 아이템 쿠폰 정의
 */
export interface FreeItemCouponDefinition extends BaseCouponDefinition {
  type: 'freeItem';               // 무료 아이템 쿠폰
}

export type CouponDefinition =
  | PercentCouponDefinition
  | FixedAmountCouponDefinition
  | FreeItemCouponDefinition;

/**
 * CouponDefinition 기본 생성 팩토리
 * @param overrides - 덮어쓸 필드 (type, stampsRequired 등 필수)
 * @returns 완전한 CouponDefinition 객체
 * @example
 * createDefaultCouponDefinition({ type: 'percentDiscount', stampsRequired: 10, discountRate: 15 });
 */
export function createDefaultCouponDefinition(
  overrides: Partial<CouponDefinition> & { type: CouponDefinition['type']; stampsRequired: number }
): CouponDefinition {
  const now = Timestamp.now();
  const { type, stampsRequired, ...rest } = overrides;

  // 기본 공통값
  const base: Omit<BaseCouponDefinition, 'id' | 'stampsRequired'> = {
    couponName: '',
    eventName: '',
    maxIssueCount: -1,
    whereToUse: 'all',
    availableProductIds: [],
    availableCategoryIds: [],
    dateCreated: now,
    dateModified: now,
    dateExpiration: null,
    validForDays: -1,
    memo: '',
  };

  const id = generateDefinitionId();

  switch (type) {
    case 'percentDiscount':
      return {
        id,
        ...base,
        type,
        stampsRequired,
        discountRate: 0,
        discountMaxAmount: undefined,
        ...rest,
      };

    case 'fixedAmountDiscount':
      return {
        id,
        ...base,
        type,
        stampsRequired,
        discountAmount: 0,
        isPossibleSave: false,
        ...rest,
      };

    case 'freeItem':
      return {
        id,
        ...base,
        type,
        stampsRequired,
        ...rest,
      };

    default:
      throw new Error(`Unsupported coupon type: ${type}`);
  }
}

/**
 * 쿠폰 정의 ID 자동 생성
 */
function generateDefinitionId(): string {
  const ts = Date.now().toString();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `def_${ts}_${rand}`;
}

