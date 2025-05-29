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
    // 회사 정버는 리스닝을 하고 있지만
    // 리스닝이 읽기보다 속도가 조금 느리기 때문에 살려둠.
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
    console.log('uid:', uid,'companyId:', companyId)
    if (!companyId) {
      console.error('❌ companyId가 없습니다. 하위 문서를 조회할 수 없습니다.');
      return;
    }

    if (!uid) {
      console.error('❌ 하위 문서의 id가 없습니다.');
      return;
    }
    

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
