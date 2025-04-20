// src/services/category/categoryService.ts
import type { Category } from '@/shared-types/category/category'
import { createDocumentService } from '@/services/common/documentService'
import type { ApiResponse } from '~/shared-types/apiResponse'

export function createCategoryService(mode: 'guest') {
  const documentService = createDocumentService<Category>('category', mode) // 'categories'는 collectionId입니다.

  return {
    /**
     * 전체 카테고리 조회
     */
    async getAll(companyId: string) {
      return await documentService.getAll(companyId)
    },

    /**
     * 수정된 카테고리만 조회 (since 기준)
     */
    async getModified(companyId: string, since: number) {
      return await documentService.getAll(companyId, since)
    },

    /**
     * 단일 카테고리 조회
     */
    async getById(companyId: string, itemId: string) {
      return await documentService.getOne(companyId, itemId)
    },

    /**
     * 카테고리 저장 (단일)
     */
    async saveItem(companyId: string, category: Category) {
      return await documentService.save(companyId, category)
    },

    /**
     * 카테고리 저장 (복수)
     */
    async saveItems(companyId: string, categories: Category[]) {
      return await documentService.saveMany(companyId, categories)
    },

    /**
     * 카테고리 삭제
     */
    async deleteItem(companyId: string, itemId: string) {
      return await documentService.deleteItem(companyId, itemId)
    },

    /**
     * 삭제된 카테고리 ID 목록 조회
     */
    async getDeleted(companyId: string):Promise<ApiResponse<string[]>> {
      return await documentService.getDeleted(companyId)
    },
  }
}
