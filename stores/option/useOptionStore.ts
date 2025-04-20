import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import { createOptionService } from '@/services/option/optionService'
import type { Option } from '@/shared-types/option/option'

export const useOptionStore = createVersionedStore<Option>({
  storeId: 'option',
  cacheKey: 'option',
  getDataModified: (companyId, since) =>
    createOptionService('guest').getModified(companyId, since),
  getDataDeleted: (companyId) =>
    createOptionService('guest').getDeleted(companyId),

  // ✅ CRUD 기능 포함
  // saveItem: (companyId, item) =>
  //   createOptionService().saveItem(companyId, item),
  // saveItems: (companyId, items) =>
  //   createOptionService().saveItems(companyId, items),
  // deleteItem: (companyId, id) =>
  //   createOptionService().deleteItem(companyId, id),
})
