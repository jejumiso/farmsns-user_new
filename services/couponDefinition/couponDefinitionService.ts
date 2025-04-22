// src/services/couponDefinition/couponDefinitionService.ts
import type { CouponDefinition } from '@/shared-types/coupon/couponDefinition'
import { createSubcollectionService } from '@/services/common/subcollectionService'
import type { ApiResponse } from '~/shared-types/apiResponse'

type Mode = 'admin' | 'guest'

export function createCouponDefinitionService(
  col1: string, // 부모 컬렉션 이름 (예: 'companies')
  doc1: string, // 부모 도큐먼트 ID (예: 'companyId')
  col2: string, // 서브컬렉션 이름 (예: 'couponDefinitions')
  mode: Mode = 'admin' // 모드 (admin 또는 guest)
) {
  // Create a subcollection service for coupon definitions
  const subcollectionService = createSubcollectionService<CouponDefinition>(col1, doc1, col2, mode)

  return {
    /**
     * 전체 쿠폰 정의 조회 (실시간으로 불러오기)
     * @param companyId 회사 ID
     */
    async getAll(companyId: string): Promise<ApiResponse<CouponDefinition[]>> {
      return await subcollectionService.getAll() // 실시간으로 쿠폰 정의 불러오기
    },

    /**
     * 수정된 쿠폰 정의만 조회 (since 기준)
     * @param companyId 회사 ID
     * @param since 수정된 이후의 timestamp
     */
    async getModified(since: number): Promise<ApiResponse<CouponDefinition[]>> {
      return await subcollectionService.getAll() // 실시간 수정된 데이터 불러오기
    },

    /**
     * 단일 쿠폰 정의 조회
     * @param companyId 회사 ID
     * @param itemId 쿠폰 정의 ID
     */
    async getById(itemId: string): Promise<ApiResponse<CouponDefinition>> {
      return await subcollectionService.getOne(itemId) // 실시간으로 단일 쿠폰 정의 조회
    },

    /**
     * 쿠폰 정의 저장 (단일)
     * @param companyId 회사 ID
     * @param couponDefinition 쿠폰 정의 객체
     */
    async saveItem( couponDefinition: CouponDefinition): Promise<ApiResponse> {
      return await subcollectionService.save(couponDefinition) // 서버에 실시간으로 저장
    },

    /**
     * 쿠폰 정의 삭제
     * @param companyId 회사 ID
     * @param itemId 쿠폰 정의 ID
     */
    async deleteItem(companyId: string, itemId: string): Promise<ApiResponse> {
      return await subcollectionService.delete(itemId) // 실시간으로 삭제
    }
  }
}
