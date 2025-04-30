// src/utils/withApiSafety.ts
import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/shared-types/apiResponse'

export async function withApiSafety<T>(
  request: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> {
  try {
    const res = await request()
    return res.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      // 서버에서 내려준 에러 메시지를 그대로 사용
      return error.response.data
    }
    
    return {
      isSuccess: false,
      message: error?.message || 'Unknown error',
    }
  }
}
