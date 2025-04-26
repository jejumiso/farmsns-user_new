// src/services/alimtalk/alimtalkService.ts
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '~/shared-types/apiResponse'
import type { KakaoAlimTemplate } from '~/shared-types/kakao/templateResponse'

export function createAlimtalkService() {
  const api = useApi()

  return {
    /**
     * 알림톡 템플릿 목록 조회
     * @param kakaoChannelId 카카오 채널 ID
     */
    async getTemplatesByChannelId(senderkey: string) : Promise<ApiResponse<KakaoAlimTemplate[]>> {
      const response = await api.post('/api/alligo/templateList', {
        senderkey,
      })

      return response.data // 알리고 원본 응답 그대로 반환
    },

    /**
     * 알림톡 발송 요청
     * @param payload 알림톡 전송에 필요한 데이터
     */
    async sendAlimtalk(payload: any) {
      const response = await api.post('/api/alligo/alimtalkSend', payload)
      return response.data
    }
  }
}
