// composables/useCompanyChange.ts

import { watchCompanyRealtime } from '@/utils/watchCompanyRealtime'
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'

export async function handleCompanyChange(companyId: string) {
  if (!companyId) return

  // ✅ 캐시 복원
  useProductStore().restoreCache(companyId)
  useCategoryStore().restoreCache(companyId)
  useOptionStore().restoreCache(companyId)
  useOptionGroupStore().restoreCache(companyId)

  // ✅ 실시간 버전 동기화 시작
  watchCompanyRealtime(companyId)
}
