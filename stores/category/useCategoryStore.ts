import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import type { Category } from '@/shared-types/category/category'
import { createCategoryService } from '@/services/category/categoryService'

export const useCategoryStore = createVersionedStore<Category>({
  storeId: 'category',
  cacheKey: 'category',
  getDataModified: (companyId, since) =>
    createCategoryService('guest').getModified(companyId, since),
  getDataDeleted: (companyId) =>
    createCategoryService('guest').getDeleted(companyId),

  // ✅ CRUD 기능 포함
  // saveItem: (companyId, item) =>
  //   createCategoryService().saveItem(companyId, item),
  // saveItems: (companyId, items) =>
  //   createCategoryService().saveItems(companyId, items),
  // deleteItem: (companyId, id) =>
  //   createCategoryService().deleteItem(companyId, id),
})
