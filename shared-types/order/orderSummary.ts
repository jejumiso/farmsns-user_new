// orderSummary.ts
import type { IssuedCoupon } from "../coupon/issuedCoupon";
import type { DeliveryAddress } from "../delivery-address/deliveryAddress";

// 수정된 OrderSummary 인터페이스
export interface OrderSummary {
  selectedCoupons: IssuedCoupon[]; // 선택된 쿠폰들
  deliveryFee: number; // 배송비
  paymentMethod: string; // 결제 방법
  usedPoint: number; // 사용된 포인트
  selectedAddress: DeliveryAddress | null; // 배송지
  distance: number | null; // 배송지와 가게의 거리
  selectedMethod:string
  customerMemo: string; // 고객 메모
}
