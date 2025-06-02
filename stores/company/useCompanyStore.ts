// 📁 stores/company/useCompanyStore.ts
import { defineStore } from 'pinia'
import type { Company } from '@/shared-types/company/company'
import { createCompanyService } from '@/services/company/companyService'
import { getCompanyCache, setCompanyCache } from '@/utils/cache/companyCache'

export const useCompanyStore = defineStore('company', {
  state: () => ({
    items: [] as Company[],
    loading: false,
    error: null as string | null,
    currentCompanyId: null as string | null,
  }),

  getters: {
    currentCompany: (state) => {
      return state.items.find(c => c.id === state.currentCompanyId) || null
    }
  },

  actions: {
    restoreCache(companyId: string) {
      const cached = getCompanyCache<Company>('company', companyId)
      if (cached) {
        const idx = this.items.findIndex(c => c.id === cached.data.id)
        if (idx !== -1) {
          this.items[idx] = cached.data
        } else {
          this.items.push(cached.data)
        }
      }
    },

    async fetchCompany(companyId: string) {
      this.loading = true
      try {
        const service = createCompanyService('guest')
        const res = await service.getById('',companyId)
        if (res.isSuccess && res.data) {
          const company = res.data as Company
          const idx = this.items.findIndex(c => c.id === company.id)
          if (idx !== -1) {
            this.items[idx] = company
          } else {
            this.items.push(company)
          }
          setCompanyCache('company', companyId, company)
          this.currentCompanyId = company.id
        } else {
          this.error = res.message || '회사 정보를 가져올 수 없습니다.'
        }
      } catch (err: any) {
        console.error('회사 불러오기 실패:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrentCompanyId(companyId: string) {
      this.currentCompanyId = companyId
    }
  },

  persist: true
})
