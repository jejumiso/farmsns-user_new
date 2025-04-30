// 📁 src/services/order/createOrderService.ts

import { useApi } from '@/composables/useApi'
import { withApiSafety } from '@/utils/withApiSafety'
import type { Order } from '@/shared-types/order/order'
import type { ApiResponse } from '@/shared-types/apiResponse'

export function createOrderService() {
  const baseUrl = '/api/order'

  return {
    /**
     * 주문 생성 (placeOrder)
     */
    async placeOrder(companyId: string, order: Order): Promise<ApiResponse> {
      return withApiSafety(() =>
        useApi().post<ApiResponse>(`${baseUrl}/place`, { companyId, order })
      )
    }
  }
}
