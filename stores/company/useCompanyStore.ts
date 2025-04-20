// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { doc, onSnapshot } from 'firebase/firestore'
// import type { CompanyMeta } from '@/shared-types/company/companyMeta'
// import { COLLECTION_PERMISSIONS } from '@/shared-constants/collections'
// import { getFirebaseDb } from '@/services/firebaseService'
// import { getCompanyCache, setCompanyCache } from '@/utils/cache/companyCache'
// import { useProductStore } from '@/stores/product/useProductStore'
// import { useCategoryStore } from '@/stores/category/useCategoryStore'
// import { withApiSafety } from '@/utils/withApiSafety'
// import { useApi } from '@/composables/useApi'

// export const useCompanyStore = defineStore('company', () => {
//   const info = ref<CompanyMeta | null>(null)
//   const loading = ref(false)
//   const error = ref<string | null>(null)

//   const unsubscribe = ref<() => void>()
//   const currentVersion = ref<Record<string, number>>({})

//   /**
//    * ✅ 캐시에서 불러오기
//    */
//   function loadFromCache(companyId: string) {
//     const cached = getCompanyCache<CompanyMeta>('company', companyId)
//     if (cached) {
//       info.value = cached
//     }
//   }

//   /**
//    * ✅ 캐시에 저장
//    */
//   function saveToCache(companyId: string, data: CompanyMeta) {
//     setCompanyCache<CompanyMeta>('company', companyId, data)
//   }

//   /**
//    * ✅ 회사 정보 API로 수동 조회
//    */
//   async function fetchCompany(companyId: string) {
//     loading.value = true
//     const res = await withApiSafety(() =>
//       useApi().get(`/api/public/company/${companyId}`)
//     )
//     loading.value = false

//     if (res.isSuccess && res.data) {
//         info.value = res.data as CompanyMeta

//       saveToCache(companyId, info.value)
//     } else {
//       error.value = res.message || '회사 정보 불러오기 실패'
//     }
//   }

//   /**
//    * ✅ 실시간 리스닝 시작
//    */
//   function listenRealtime(companyId: string) {
//     stopListening()
  
//     // 1️⃣ 캐시 불러오기 + info에 반영
//     const cached = getCompanyCache<CompanyMeta>('company', companyId)
//     if (cached) {
//       info.value = cached
  
//       // 🔄 캐시에서 이전 버전 정보 기억
//       currentVersion.value.productVersion = cached.productVersion ?? 0
//       currentVersion.value.categoryVersion = cached.categoryVersion ?? 0
//     }
  
//     // 2️⃣ 실시간 리스닝 시작
//     const docRef = doc(
//       getFirebaseDb(),
//       COLLECTION_PERMISSIONS.company.name,
//       companyId
//     )
  
//     unsubscribe.value = onSnapshot(docRef, (snapshot) => {
//       if (!snapshot.exists()) return
  
//       const data = snapshot.data() as CompanyMeta
  
//       // 🔍 변경 감지: 캐시 버전 기준으로 비교
//       const versionKeys = ['productVersion', 'categoryVersion'] as const
//       for (const key of versionKeys) {
//         const newVer = data[key]
//         const oldVer = currentVersion.value[key]
  
//         if (typeof newVer === 'number' && newVer !== oldVer) {
//           currentVersion.value[key] = newVer // 최신 버전으로 갱신
  
//           if (key === 'productVersion') {
//             useProductStore().syncWithServer(companyId)
//           }
//           if (key === 'categoryVersion') {
//             useCategoryStore().syncWithServer(companyId)
//           }
//         }
//       }
  
//       // ✅ 최종적으로 최신 데이터 반영
//       info.value = data
//       saveToCache(companyId, data)
//     })
//   }
  

//   /**
//    * ✅ 리스닝 해제
//    */
//   function stopListening() {
//     unsubscribe.value?.()
//     unsubscribe.value = undefined
//   }

//   return {
//     info,
//     loading,
//     error,
//     fetchCompany,
//     listenRealtime,
//     stopListening,
//   }
// })
