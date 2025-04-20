// import { useApi } from '@/composables/useApi';
// import type { ApiResponse } from '@/shared-types/apiResponse';
// import type { Category } from '@/shared-types/category/category';

// export function createCategoriesService() {
//   const api = useApi();

//   return {
//     // ✅ 회사별 카테고리 목록 조회 (since 타임스탬프 기준)
//     async getCompanyCategories(companyId: string, since: number): Promise<ApiResponse> {
//       const response = await api.get(`/api/categories/${companyId}`, {
//         params: { since },
//       });
//       return response.data as ApiResponse;
//     },

//   };
// }
