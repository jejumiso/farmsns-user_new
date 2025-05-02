import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse'

export async function deleteCardFromProfile(cardId: string): Promise<ApiResponse<null>> {
  try {
    const res = await useApi().post<ApiResponse<null>>('/api/payment/delete-card', {
      cardId,
    })
    return res.data
  } catch (error: any) {
    const serverResponse = error.response?.data
    return {
      isSuccess: false,
      message: serverResponse?.message || error.message || '카드 삭제 요청 실패',
      error: serverResponse?.error || error.message || '카드 삭제 요청 실패',
    }
  }
}
