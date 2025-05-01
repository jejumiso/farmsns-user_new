// 📁 services/payment/saveRegisteredCardService.ts
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse'
import type { ProfileCardInfo } from '~/shared-types/nicepay/ProfileCardInfo'
import type { CardBidInfo } from '~/shared-types/nicepay/CardBidInfo'

export async function saveRegisteredCard(
  companyId: string,
  cardInfo: ProfileCardInfo,
  bidInfo: CardBidInfo
): Promise<ApiResponse<null>> {
  try {
    const res = await useApi().post<ApiResponse<null>>('/api/payment/save-registered-card', {
      companyId,
      cardInfo,
      bidInfo
    })

    return res.data
  } catch (error: any) {
    const serverResponse = error.response?.data

    return {
      isSuccess: false,
      message: serverResponse?.message || error.message || '카드 저장 요청 실패',
      error: serverResponse?.error || error.message || '카드 저장 요청 실패',
    }
  }
}
