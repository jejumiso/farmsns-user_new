// src/services/product/productService.ts
import type { Product } from '@/shared-types/product/product'
import { createDocumentService } from '@/services/common/documentService'

type Mode = 'admin' | 'guest'

export function createProductService(mode: Mode = 'guest') {
  const documentService = createDocumentService<Product>('product', mode)

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

    async saveItem(companyId: string, product: Product) {
      return await documentService.save(companyId, product)
    },

    async saveItems(companyId: string, products: Product[]) {
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

