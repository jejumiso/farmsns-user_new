
// 📁 shared-types/api/order/placeOrderRequest.ts

import type { Order } from "@/shared-types/order/order";
/**
 * 주문 요청에 포함할 추가 스냅샷 타입 정의
 */
export interface PlaceOrderRequestBody {
    companyId: string;
    order: Order;
    clientSnapshot?: {
      customerCompanyActivity?: {
        pointRemaining: number;
        stampRemaining: number;
      };
    };
  }