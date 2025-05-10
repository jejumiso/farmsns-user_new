import { type CouponDefinition } from "@/shared-types/coupon/couponDefinition";
import { type IssuedCoupon, createIssuedCoupon } from "@/shared-types/coupon/issuedCoupon";
import { type CustomerProfile } from "@/shared-types/customer-profile/customerProfile";
import { type UserSummary } from "@/shared-types/user/userSummary";
import { Timestamp } from "@/shared/firebase/firebaseTypes";

/**
 * 가장 높은 조건의 쿠폰 기준으로 스탬프 주기를 결정하고,
 * 그 범위 내에서 조건을 만족하는 쿠폰들을 모두 발급합니다.
 */
export function calculateAccurateCouponIssuance(
  currentStamp: number,
  addedStamp: number,
  couponDefs: CouponDefinition[],
  companyId: string,
  userSummary: UserSummary,
  timestamp: Timestamp
): { issuedCoupons: IssuedCoupon[]; usedStamps: number } {
  const totalStamp = currentStamp + addedStamp;

  const maxRequired = Math.max(...couponDefs.map(def => def.stampsRequired));
  const cycleCount = Math.floor(totalStamp / maxRequired);
  const usedStamps = cycleCount * maxRequired;
  const issuedCoupons: IssuedCoupon[] = [];
  const remainder = totalStamp % maxRequired;

  console.log('⏱ 스탬프 계산 정보 ------------------');
  console.log(`✅ currentStamp: ${currentStamp}`);
  console.log(`➕ addedStamp: ${addedStamp}`);
  console.log(`🔁 totalStamp: ${totalStamp}`);
  console.log(`🎯 maxRequired: ${maxRequired}`);
  console.log(`🔄 cycleCount: ${cycleCount}`);
  console.log(`🧾 usedStamps: ${usedStamps}`);
  console.log('------------------------------------');

  for (const def of couponDefs) {
    const countBefore = currentStamp >= def.stampsRequired ? 1 : 0;
    const countAfter = remainder >= def.stampsRequired ? 1 : 0;

    const newCount = cycleCount + countAfter - countBefore;

    console.log(`🪙 쿠폰 ID: ${def.id}, 조건: ${def.stampsRequired}개`);
    console.log(`📌 countBefore: ${countBefore}`);
    console.log(`📌 countAfter: ${countAfter}`);
    console.log(`🎉 newCount (발급 수): ${newCount}`);

    for (let i = 0; i < newCount; i++) {
      const issued = createIssuedCoupon(def, companyId, userSummary, timestamp);
      issuedCoupons.push(issued);
    }
  }

  return { issuedCoupons, usedStamps };
}
