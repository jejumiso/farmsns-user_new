// src/services/common/documentService.ts
import type { BaseDocument } from '@/shared-types/common/documentMeta'
import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse'

import { withApiSafety } from '@/utils/withApiSafety'
import type { COLLECTION_PERMISSIONS } from '~/shared-constants/collections'

type Mode = 'admin' | 'guest'

export function createDocumentService<T>(
  collectionId: keyof typeof COLLECTION_PERMISSIONS,
  mode: Mode = 'admin' // 기본은 관리자용
) {
  const baseUrl = `api/document/${mode}/${collectionId}`

  return {
    async getOne(companyId: string, itemId: string): Promise<ApiResponse<T>> {
      return withApiSafety(() =>
        useApi().get<ApiResponse<T>>(`${baseUrl}/${itemId}`, {
          params: { companyId }
        })
      )
    },

    async getAll(companyId: string, since?: number): Promise<ApiResponse<T[]>> {
      return withApiSafety(() =>
        useApi().get<ApiResponse<T[]>>(baseUrl, {
          params: { companyId, ...(since ? { since } : {}) }
        })
      )
    },

    async save(companyId: string, item: T): Promise<ApiResponse> {
      return withApiSafety(() =>
        useApi().post<ApiResponse>(baseUrl, { companyId, item })
      )
    },

    async saveMany(companyId: string, items: T[]): Promise<ApiResponse> {
      return withApiSafety(() =>
        useApi().post<ApiResponse>(`${baseUrl}/saveMany`, { companyId, items })
      )
    },

    async deleteItem(companyId: string, itemId: string): Promise<ApiResponse> {
      return withApiSafety(() =>
        useApi().delete<ApiResponse>(`${baseUrl}/${itemId}`, {
          params: { companyId }
        })
      )
    },

    async getDeleted(companyId: string): Promise<ApiResponse<string[]>> {
      return withApiSafety(() =>
        useApi().get<ApiResponse<string[]>>(`${baseUrl}/deleted`, {
          params: { companyId }
        })
      )
    }
  }
}

