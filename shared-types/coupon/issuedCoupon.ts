// 📁 shared-types/coupon/issuedCoupon.ts
import type { Timestamp } from "@/shared/firebase/firebaseTypes";
import type { Channel } from "./couponDefinition";
import type { CouponDefinition } from "./couponDefinition";
import type { UserSummary } from "../user/userSummary";

export type CouponUsageLog = {
  type: 'requested' | 'approved' | 'cancelled' | 'used'
  by: string
  dateLogged: Timestamp
  note?: string
}

export type CouponUsage = {
  companyId: string
  orderId: string
  usedAmount: number
}

interface BaseIssuedCoupon {
  id: string
  uid: string
  userSummary: UserSummary // ✅ 사용자 요약 정보 포함

  couponDefinitionId: string
  couponName: string
  eventName: string
  status: 'active' | 'used' | 'expired' | 'requested' | 'cancelled'
  issuingCompanyId: string
  whereToUse: Channel
  couponUsage: CouponUsage[]
  availableCompanyIds?: string[]
  availableBrandNames?: string[]
  availableProductIds?: string[]
  availableCategoryIds?: string[]
  usageLog: CouponUsageLog[]
  memo?: string

  dateIssued: Timestamp
  dateExpiration: Timestamp | null
  dateIssuedyyyy: number
  dateIssuedyyyyMM: number
  dateIssuedyyyyMMdd: number
}

export interface PercentIssuedCoupon extends BaseIssuedCoupon {
  type: 'percentDiscount'
  discountRate: number
  discountMaxAmount?: number
  usedAmount: number
}

export interface FixedAmountIssuedCoupon extends BaseIssuedCoupon {
  type: 'fixedAmountDiscount'
  discountAmount: number
  usedAmount: number
  isPossibleSave: boolean
}

export interface FreeItemIssuedCoupon extends BaseIssuedCoupon {
  type: 'freeItem'
  usedAmount: number
}

export type IssuedCoupon =
  | PercentIssuedCoupon
  | FixedAmountIssuedCoupon
  | FreeItemIssuedCoupon

export function createIssuedCoupon(
  def: CouponDefinition,
  companyId: string,
  userSummary: UserSummary, // ✅ 전체 객체로 받음
  issuedAt: Timestamp
): IssuedCoupon {
  const date = new Date(issuedAt.toDate())
  const yyyy = date.getFullYear()
  const yyyyMM = yyyy * 100 + (date.getMonth() + 1)
  const yyyyMMdd = yyyy * 10000 + (date.getMonth() + 1) * 100 + date.getDate()

  const base: BaseIssuedCoupon = {
    id: generateIssuedId(),
    uid: userSummary.uid,
    userSummary,
    couponDefinitionId: def.id,
    couponName: def.couponName,
    eventName: def.eventName,
    status: 'active',
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
    dateExpiration: def.dateExpiration ?? null,
    dateIssuedyyyy: yyyy,
    dateIssuedyyyyMM: yyyyMM,
    dateIssuedyyyyMMdd: yyyyMMdd,
  }

  switch (def.type) {
    case 'percentDiscount':
      return {
        ...base,
        type: 'percentDiscount',
        discountRate: def.discountRate,
        ...(def.discountMaxAmount !== undefined && { discountMaxAmount: def.discountMaxAmount }),
        usedAmount: 0,
      }
    case 'fixedAmountDiscount':
      return {
        ...base,
        type: 'fixedAmountDiscount',
        discountAmount: def.discountAmount,
        usedAmount: 0,
        isPossibleSave: def.isPossibleSave,
      }
    case 'freeItem':
      return {
        ...base,
        type: 'freeItem',
        usedAmount: 0,
      }
  }
}

function generateIssuedId(): string {
  const ts = Date.now().toString()
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `iss_${ts}_${rand}`
}
