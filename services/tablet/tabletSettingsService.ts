// src/services/tablet/tabletSettingsService.ts
import { createSubcollectionService } from '@/services/common/subcollectionService'
import type { TabletSettings } from '@/shared-types/tablet-settings/tabletSettings'
import type { ApiResponse } from '@/shared-types/apiResponse'

export function createTabletSettingsService(companyId: string) {
  const service = createSubcollectionService<TabletSettings>(
    'v2_companies',
    companyId,
    'v2_tablets',
    'admin'
  )

  return {
    async getAll(): Promise<ApiResponse<TabletSettings[]>> {
      return await service.getAll()
    },

    async getById(tabletId: string): Promise<ApiResponse<TabletSettings>> {
      return await service.getOne(tabletId)
    },

    async saveItem( settings: TabletSettings): Promise<ApiResponse> {
      return await service.save( settings)
    },

    async deleteItem(tabletId: string): Promise<ApiResponse> {
      return await service.delete(tabletId)
    }
  }
}
