import type { Company } from '@/shared-types/company/company'
import { createDocumentService } from '@/services/common/documentService'
import type { ApiResponse } from '@/shared-types/apiResponse'

export function createCompanyService(mode: 'admin' | 'guest') {
  const documentService = createDocumentService<Company>('company', mode)

  return {
    /**
     * 전체 회사 조회
     */
    async getAll(_: string = '') {
      return await documentService.getAll('')
    },

    /**
     * 수정된 회사만 조회 (since 기준)
     */
    async getModified(_: string = '', since: number) {
      return await documentService.getAll('', since)
    },

    /**
     * 단일 회사 조회
     */
    async getById(_: string = '', itemId: string) {
      return await documentService.getOne('', itemId)
    },

    /**
     * 회사 저장 (단일)
     */
    async saveItem(_: string = '', company: Company) {
      return await documentService.save('', company)
    },

    /**
     * 회사 저장 (복수)
     */
    async saveItems(_: string = '', companies: Company[]) {
      return await documentService.saveMany('', companies)
    },

    /**
     * 삭제된 회사 ID 목록 조회
     */
    async getDeleted(_: string = ''): Promise<ApiResponse<string[]>> {
      return await documentService.getDeleted('')
    },

    /**
     * 회사 삭제
     */
    async deleteItem(_: string = '', id: string) {
      return await documentService.deleteItem('', id)
    },
  }
}
