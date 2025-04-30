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
  console.log('📦 createSubcollectionService 호출됨:', {
    mode,
    parentCollection,
    parentId,
    subCollection
  });

  const baseUrl = `/api/subcollection/${mode}/${parentCollection}/${parentId}/${subCollection}`;

  return {
    async getOne(subId: string): Promise<ApiResponse<T>> {
      console.log('🔍 getOne 호출:', { fullUrl: `${baseUrl}/${subId}` });
      return withApiSafety(() =>
        useApi().get<ApiResponse<T>>(`${baseUrl}/${subId}`)
      );
    },
    async getAll(): Promise<ApiResponse<T[]>> {
      console.log('📋 getAll 호출:', { fullUrl: baseUrl });
      return withApiSafety(() =>
        useApi().get<ApiResponse<T[]>>(baseUrl)
      );
    },
    async save(item: T): Promise<ApiResponse> {
      console.log('💾 save 호출:', { fullUrl: baseUrl, item });
      return withApiSafety(() =>
        useApi().post<ApiResponse>(`${baseUrl}`, item)
      );
    },
    async delete(subId: string): Promise<ApiResponse> {
      console.log('❌ delete 호출:', { fullUrl: `${baseUrl}/${subId}` });
      return withApiSafety(() =>
        useApi().delete<ApiResponse>(`${baseUrl}/${subId}`)
      );
    }
  }
}
