import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { createProductService } from '@/services/product/productService'
import type { Product } from '@/shared-types/product/product'

export const useProductStore = createVersionedStore<Product>({
  storeId: 'product',
  cacheKey: 'product',
  getDataModified: (companyId, since) =>
    createProductService('guest').getModified(companyId, since),
  getDataDeleted: (companyId) =>
    createProductService('guest').getDeleted(companyId),


})
