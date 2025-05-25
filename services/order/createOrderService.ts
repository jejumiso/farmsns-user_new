// 📁 src/services/order/createOrderService.ts

import { useApi } from '@/composables/useApi'
import { withApiSafety } from '@/utils/withApiSafety'
import type { Order } from '@/shared-types/order/order'
import type { ApiResponse } from '@/shared-types/apiResponse'
import type { PlaceOrderRequestBody } from '@/shared-types/api/order/placeOrderRequest'



export function createOrderService() {
  const baseUrl = '/api/order'

  return {
    /**
     * 주문 생성 (placeOrder)
     * @param companyId 회사 ID
     * @param order 주문 정보
     * @param clientSnapshot 사용자 스냅샷 (포인트, 스탬프)
     */
    async placeOrder(
      companyId: string,
      order: Order,
      clientSnapshot?: PlaceOrderRequestBody['clientSnapshot']
    ): Promise<ApiResponse> {
      const payload: PlaceOrderRequestBody = {
        companyId,
        order,
        clientSnapshot,
      }

      return withApiSafety(() =>
        useApi().post<ApiResponse>(`${baseUrl}/placeWithModel`, payload)
      )
    }
  }
}
