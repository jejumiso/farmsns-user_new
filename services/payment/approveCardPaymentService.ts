// 📁 services/payment/approveCardPaymentService.ts
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse'

export async function approveCardPayment(
  companyId: string,
  orderId: string,
  bid: string,
  amount: number,
  goodsName: string = '주문 상품'
): Promise<ApiResponse<null>> {
  try {
    const res = await useApi().post<ApiResponse<null>>('/api/payment/approve-card-payment', {
      companyId,
      orderId,
      bid,
      amount,
      goodsName,
    })
    return res.data
  } catch (error: any) {
    const serverResponse = error.response?.data
    return {
      isSuccess: false,
      message: serverResponse?.message || error.message || '카드 결제 승인 실패',
      error: serverResponse?.error || error.message || '카드 결제 승인 실패',
    }
  }
}
