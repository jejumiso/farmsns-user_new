// src/services/product/productService.ts
import { createDocumentService } from '@/services/common/documentService'
import type { CustomerProfile } from '~/shared-types/customer-profile/customerProfile'

type Mode = 'admin' | 'guest'

export function createCustomerProfileService(mode: 'admin'|'guest') {
  const documentService = createDocumentService<CustomerProfile>('user', mode)

  return {
    async getAll(companyId: string) {
      return await documentService.getAll(companyId)
    },

    async getModified(companyId: string, since: number) {
      return await documentService.getAll(companyId, since)
    },

    async getById(companyId: string, itemId: string) {
      return await documentService.getOne(companyId, itemId)
    },

    async saveItem(companyId: string, product: CustomerProfile) {
      return await documentService.save(companyId, product)
    },

    async saveItems(companyId: string, products: CustomerProfile[]) {
      return await documentService.saveMany(companyId, products)
    },

    async deleteItem(companyId: string, itemId: string) {
      return await documentService.deleteItem(companyId, itemId)
    },

    async getDeleted(companyId: string) {
      return await documentService.getDeleted(companyId)
    },
  }
}

