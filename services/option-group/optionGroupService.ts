import type { OptionGroup } from '@/shared-types/option/optionGroup'
import { createDocumentService } from '@/services/common/documentService'
import type { ApiResponse } from '@/shared-types/apiResponse'

export function createOptionGroupService(mode: 'guest') {
  const documentService = createDocumentService<OptionGroup>('optionGroup', mode)

  return {
    /**
     * 전체 옵션 그룹 조회
     */
    async getAll(companyId: string): Promise<ApiResponse<OptionGroup[]>> {
      return await documentService.getAll(companyId)
    },

    /**
     * 수정된 옵션 그룹만 조회 (since 기준)
     */
    async getModified(companyId: string, since: number): Promise<ApiResponse<OptionGroup[]>> {
      return await documentService.getAll(companyId, since)
    },

    /**
     * 단일 옵션 그룹 조회
     */
    async getById(companyId: string, itemId: string): Promise<ApiResponse<OptionGroup>> {
      return await documentService.getOne(companyId, itemId)
    },

    /**
     * 옵션 그룹 저장 (단일)
     */
    async saveItem(companyId: string, group: OptionGroup): Promise<ApiResponse> {
      return await documentService.save(companyId, group)
    },

    /**
     * 옵션 그룹 저장 (복수)
     */
    async saveItems(companyId: string, groups: OptionGroup[]): Promise<ApiResponse> {
      return await documentService.saveMany(companyId, groups)
    },

    /**
     * 옵션 그룹 삭제
     */
    async deleteItem(companyId: string, groupId: string): Promise<ApiResponse> {
      return await documentService.deleteItem(companyId, groupId)
    },

    /**
     * 삭제된 옵션 그룹 ID 목록 조회
     */
    async getDeleted(companyId: string): Promise<ApiResponse<string[]>> {
      return await documentService.getDeleted(companyId)
    },
  }
}
