// // // plugins/initStore.ts
// // import { defineNuxtPlugin } from '#app'
// // import { watch } from 'vue'
// // import { useAuthStore } from '@/stores/auth/useAuthStore'
// // import { useProductStore } from '~/stores/product/useProductStore'
// // import { useCategoryStore } from '~/stores/category/useCategoryStore'
// // import { useOptionStore } from '~/stores/option/useOptionStore'
// // import { useOptionGroupStore } from '~/stores/option-group/useOptionGroupStore'



// // export default defineNuxtPlugin(() => {
// //   const authStore = useAuthStore()

// //   let lastCompanyId: string | null = null

// //   const productStore = useProductStore()
// // const categoryStore = useCategoryStore()
// // const optionStore = useOptionStore()
// // const optionGroupStore = useOptionGroupStore()



// //   watch(
// //     () => authStore.currentCompany?.id,
// //     async (companyId, oldCompanyId) => {
// //       if (!companyId) return
  
// //       // 캐시 복원
// //       productStore.restoreCache()
// //       categoryStore.restoreCache()
// //       optionStore.restoreCache()
// //       optionGroupStore.restoreCache()
  
// //       // 서버 동기화
// //       await productStore.syncWithServer()
// //       await categoryStore.syncWithServer()
// //       await optionStore.syncWithServer()
// //       await optionGroupStore.syncWithServer()
// //     },
// //     { immediate: true }
// //   )
  
  
  
// // })


// import { watch } from 'vue'
// import { useAuthStore } from '@/stores/auth/useAuthStore'
// import { useProductStore } from '@/stores/product/useProductStore'
// import { useCategoryStore } from '@/stores/category/useCategoryStore'
// import { useOptionStore } from '@/stores/option/useOptionStore'
// import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'
// import { watchCompanyRealtime } from '~/utils/watchCompanyRealtime'

// export default defineNuxtPlugin(() => {
//   const authStore = useAuthStore()

//   watch(
//     () => authStore.currentCompany?.id,
//     (companyId) => {
//       if (!companyId) return

//       useProductStore().restoreCache(companyId)
//       useCategoryStore().restoreCache(companyId)
//       useOptionStore().restoreCache(companyId)
//       useOptionGroupStore().restoreCache(companyId)

//       // ✅ 실시간 버전 감지로 자동 sync
//       watchCompanyRealtime(companyId)
//     },
//     { immediate: true }
//   )
// })
