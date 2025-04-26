import { useApi } from '@/composables/useApi'
import type { PointSave } from '@/shared-types/reward/pointSave'
import type { AllimtalkRequest } from '@/shared-types/company/allim_talk_request_type'
import type { CouponDefinition } from '@/shared-types/coupon/couponDefinition'
import type { ApiResponse } from '~/shared-types/apiResponse'

const api = useApi()

/**
 * 적립 정보 저장 요청 (알림톡 포함)
 */
export async function saveRewardByPhoneNumber(payload: {
  pointSave: PointSave
  allimtalkRequest: AllimtalkRequest
  couponCreationConditions: CouponDefinition[]
  iv : string
}):Promise<ApiResponse<any>> {
  try {
    const response = await api.post('/api/reward/saveFromTabletNew', payload)
    console.log('✅ 적립 저장 성공:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 적립 저장 실패:', error)
    throw error
  }
}

/**
 * 적립 대기 수량 초기화 (0으로)
 */
export async function updatePendingReward(
  companyId: string,
  tabletNum: number,
  newAmount: number
):Promise<ApiResponse<any>>  {
  try {
    console.log('🔄 대기 적립 수량 업데이트 완료:', companyId ,'-', tabletNum ,'-', newAmount)



    const response = await api.post('/api/reward/updatePendingReward', {
      companyId,
      tabletNum,
      newAmount
    })
    console.log('🔄 대기 적립 수량 업데이트 시도:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 대기 적립 수량 업데이트 실패:', error)
    throw error
  }
}
