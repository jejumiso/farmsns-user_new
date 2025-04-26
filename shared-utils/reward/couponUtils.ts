import { type CouponDefinition } from "@/shared-types/coupon/couponDefinition";
import { type IssuedCoupon, createIssuedCoupon } from "@/shared-types/coupon/issuedCoupon";
import { Timestamp } from "@/shared/firebase/firebaseTypes";

/**
 * 스탬프 누적에 따라 발급 가능한 쿠폰 계산 및 생성
 */
export function calculateAccurateCouponIssuance(
  currentStamp: number,
  addedStamp: number,
  couponDefs: CouponDefinition[],
  companyId: string,
  uid: string,
  timestamp: Timestamp
): { issuedCoupons: IssuedCoupon[]; remainingStamps: number } {
  const totalStamp = currentStamp + addedStamp;
  const issuedCoupons: IssuedCoupon[] = [];

  // 1️⃣ 가장 높은 발급 조건 기준으로 스탬프 소모 단위 계산
  const maxRequired = Math.max(...couponDefs.map(def => def.stampsRequired));
  const b = Math.floor(totalStamp / maxRequired);
  const remainingStamps = totalStamp % maxRequired;

  // 2️⃣ 각 쿠폰 조건별로 발급 가능한 수 계산
  for (const def of couponDefs) {
    const prevCount = Math.floor(currentStamp / def.stampsRequired);
    const nextCount = Math.floor(remainingStamps / def.stampsRequired);
    const newCount = b - prevCount + nextCount;

    for (let i = 0; i < newCount; i++) {
      const issued = createIssuedCoupon(def, companyId, uid, timestamp);
      issuedCoupons.push(issued);
    }
  }

  return { issuedCoupons, remainingStamps };
}
