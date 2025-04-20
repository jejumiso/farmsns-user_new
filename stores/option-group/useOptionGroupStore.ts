import { createVersionedStore } from '@/stores/_base/createVersionedStore'
import type { OptionGroup } from '@/shared-types/option/optionGroup'
import { createOptionGroupService } from '@/services/option-group/optionGroupService'

export const useOptionGroupStore = createVersionedStore<OptionGroup>({
  storeId: 'optionGroup',
  cacheKey: 'optionGroup',
  getDataModified: (companyId, since) =>
    createOptionGroupService('guest').getModified(companyId, since),
  getDataDeleted: (companyId) =>
    createOptionGroupService('guest').getDeleted(companyId),

  // ✅ CRUD 기능 포함
  // saveItem: (companyId, item) =>
  //   createOptionGroupService().saveItem(companyId, item),
  // saveItems: (companyId, items) =>
  //   createOptionGroupService().saveItems(companyId, items),
  // deleteItem: (companyId, id) =>
  //   createOptionGroupService().deleteItem(companyId, id),
})
