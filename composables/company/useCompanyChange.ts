// composables/useCompanyChange.ts

import { watchCompanyRealtime } from '@/utils/watchCompanyRealtime'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'
import { useCompanyStore } from '@/stores/company/useCompanyStore'
import { createSubcollectionService } from '@/services/common/subcollectionService'
import type { CustomerCompanyActivity } from '~/shared-types/customer-company-activity/customerCompanyActivity'

export async function handleCompanyChange(uid: string | undefined, companyId: string) {
  if (companyId) {
    const companyStore = useCompanyStore()

    // ✅ 회사 정보 불러오기 및 현재 회사 설정
    await companyStore.fetchCompany(companyId)

    // ✅ 캐시 복원
    useProductStore().restoreCache(companyId)
    useCategoryStore().restoreCache(companyId)
    useOptionStore().restoreCache(companyId)
    useOptionGroupStore().restoreCache(companyId)

    // ✅ 실시간 버전 동기화 시작
    watchCompanyRealtime(companyId)
  }

  if (uid === undefined || companyId === undefined || companyId === '') {
    useUserAuthStore().customerCompanyActivity = null
  } else {
    console.log('uid:', uid)
    const service = createSubcollectionService<CustomerCompanyActivity>(
      'v2_companies',
      companyId,
      'v2_users',
      'guest'
    )
    const customerCompany = await service.getOne(uid)
    console.log('회사 내 유저 정보:', customerCompany)
    useUserAuthStore().customerCompanyActivity = customerCompany.data as CustomerCompanyActivity
  }
}
