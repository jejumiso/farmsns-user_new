// src/services/common/subcollectionService.ts

import { useApi } from '@/composables/useApi'
import type { ApiResponse } from '@/shared-types/apiResponse'
import { withApiSafety } from '@/utils/withApiSafety'

type Mode = 'admin' | 'guest'

export function createSubcollectionService<T>(
  parentCollection: string,
  parentId: string,
  subCollection: string,
  mode: Mode = 'admin'
) {
  const baseUrl = `/api/subcollection/${mode}/${parentCollection}/${parentId}/${subCollection}`


  return {
    async getOne(subId: string): Promise<ApiResponse<T>> {
      return withApiSafety(() =>
        useApi().get<ApiResponse<T>>(`${baseUrl}/${subId}`)
      )
    },

    async getAll(): Promise<ApiResponse<T[]>> {
      return withApiSafety(() =>
        useApi().get<ApiResponse<T[]>>(baseUrl)
      )
    },

    async save( item: T): Promise<ApiResponse> {
      return withApiSafety(() =>
        useApi().post<ApiResponse>(`${baseUrl}`, item)
      )
    },

    async delete(subId: string): Promise<ApiResponse> {
      return withApiSafety(() =>
        useApi().delete<ApiResponse>(`${baseUrl}/${subId}`)
      )
    }
  }
}
