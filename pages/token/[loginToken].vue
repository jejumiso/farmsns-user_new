<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { signInWithCustomToken } from 'firebase/auth'
import { useNuxtApp } from '#app'
import { onMounted } from 'vue'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import type { ApiResponse } from '@/shared-types/apiResponse'
import type { CustomerCompanyActivity } from '~/shared-types/customer-company-activity/customerCompanyActivity'
import type { CustomerProfile } from '~/shared-types/customer-profile/customerProfile'

interface LoginResult {
  customToken: string
  companyId: string
  customerProfile: CustomerProfile
  customerCompanyActivity: CustomerCompanyActivity | null
}

const route = useRoute()
const router = useRouter()
const { $firebaseAuth, $api } = useNuxtApp()
const {  loginToken } = route.params as {  loginToken: string }

onMounted(async () => {
  if (!loginToken ) {
    console.warn('❌ 경로 파라미터 누락')
    return router.replace('/error')
  }

  try {
    // 1. 서버에 로그인 토큰 전달 → customToken + 고객 정보 받기
    const res = await $api.post<ApiResponse<LoginResult>>('/api/userAuth/login-by-token', {
      loginToken,
    })

    const result = res.data
    // alert('로그인 결과: ' + JSON.stringify(result))

    if (!result.isSuccess || !result.data?.customToken ) {
      throw new Error(result.message || '로그인 실패')
    }
    // const authStore = useUserAuthStore()
    // 2. Firebase 로그인
    var user = await signInWithCustomToken($firebaseAuth, result.data.customToken)
    // authStore.setFirebaseUser(user.user)

    // 3. 고객 정보 저장 (Pinia)
    
    // authStore.setUser({
    //   customerProfile: result.data.customerProfile,
    //   customerCompanyActivity: result.data.customerCompanyActivity ?? null,
    // })

    if (result.data.customerCompanyActivity == null) {
      router.replace(`/`)
    }else{
      // 4. 회사의 상품 페이지로 이동
      router.replace(`/${result.data.companyId}/products`)
    }

    
  } catch (error) {
    console.error('자동 로그인 실패:', error)
    // router.replace(`/${companyId}/error`)
  }
})
</script>

<template>
  <div class="p-6 text-center text-lg">
    고객님을 자동 로그인 중입니다...
  </div>
</template>
