// 📁 services/payment/registerNiceCardService.ts
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse'
import type { RegisterNiceCardResult } from '@/shared-types/nicepay/RegisterNiceCardResult'
import type { RegisterNiceCardInput } from '~/shared-types/nicepay/RegisterNiceCardInput'

export async function registerNiceCard(companyId: string, plain: string): Promise<ApiResponse<RegisterNiceCardResult>> {
  try {

    console.log('registerNiceCard', companyId, plain)
    
    const res = await useApi().post<ApiResponse<RegisterNiceCardResult>>('/api/payment/register-card', {
      companyId,
      plain,
    })
    return res.data
  } catch (error: any) {
    const serverResponse = error.response?.data
  
    return {
      isSuccess: false,
      message: serverResponse?.message || error.message || '카드 등록 요청 실패',
      error: serverResponse?.error || error.message || '카드 등록 요청 실패',
    }
  }
}
