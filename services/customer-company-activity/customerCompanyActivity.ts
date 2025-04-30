// src/services/tablet/tabletSettingsService.ts
import { createSubcollectionService } from '@/services/common/subcollectionService'
import type { ApiResponse } from '@/shared-types/apiResponse'
import type { CustomerCompanyActivity } from '~/shared-types/customer-company-activity/customerCompanyActivity'

export function createCustomerCompanyActivityService(companyId: string) {
  const service = createSubcollectionService<CustomerCompanyActivity>(
    'v2_companies',
    companyId,
    'v2_users',
    'guest'
  )

  return {
    async getAll(): Promise<ApiResponse<CustomerCompanyActivity[]>> {
      return await service.getAll()
    },

    async getById(uid: string): Promise<ApiResponse<CustomerCompanyActivity>> {
      return await service.getOne(uid)
    },

    async saveItem( settings: CustomerCompanyActivity): Promise<ApiResponse> {
      return await service.save( settings)
    },

    async deleteItem(uid: string): Promise<ApiResponse> {
      return await service.delete(uid)
    }
  }
}
