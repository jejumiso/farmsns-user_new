// services/companies/companiesService.ts

import { useApi } from '@/composables/useApi'
import type { Company } from '@/shared-types/company/company'

export function createCompaniesService() {
  const api = useApi()

  return {
    async getCompanyByKakaoChannelId(kakaoChannelId: string): Promise<Company | null> {
      try {
        const response = await api.get('/api/companies/search-by-kakao-channel-id', {
          params: { kakaoChannelId },
        })

        const companies = response.data?.data

        if (Array.isArray(companies) && companies.length > 0) {
          return companies[0] as Company
        }

        return null
      } catch (error: any) {
        console.error('❌ 회사 검색 실패:', error.response?.data || error.message)
        throw new Error(error.response?.data?.message || '회사 검색 실패')
      }
    },
  }
}
