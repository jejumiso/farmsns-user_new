
// 📁 shared-types/coupon/userSummary.ts

import type { Timestamp } from "@/shared/firebase/firebaseTypes";


export interface UserSummary {
  uid: string;
  securedUserName:string;
  securedPhoneMain: string // 대표 핸드폰번호
  phoneSuffix: string;        // 전화번호 뒷자리 (CustomerProfile)
  memoAdmin: string;           // CustomerCompanyActivity
  orderTotalCount: number;    // CustomerCompanyActivity
  stampCount: number;         // CustomerCompanyActivity
  pointCount: number;         // CustomerCompanyActivity
  dateRecentOrder?: Timestamp;    // ISO 형식 문자열 (CustomerCompanyActivity)
  iv:string
}
