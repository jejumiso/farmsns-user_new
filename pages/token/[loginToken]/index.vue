<script setup lang="ts">
import { onMounted }            from 'vue'
import { useRoute, useRouter }  from 'vue-router'
import { signInWithCustomToken } from 'firebase/auth'
import { useNuxtApp }           from '#app'
import { useUserAuthStore }     from '@/stores/userAuth/useUserAuthStore'
import type { ApiResponse }     from '@/shared-types/apiResponse'
import type { CustomerProfile } from '~/shared-types/customer-profile/customerProfile'
import type { CustomerCompanyActivity } from '~/shared-types/customer-company-activity/customerCompanyActivity'

interface LoginResult {
  customToken: string
  companyId: string
  customerProfile: CustomerProfile
  customerCompanyActivity: CustomerCompanyActivity | null
}


const route = useRoute()
const router = useRouter()
const { $firebaseAuth, $api } = useNuxtApp()

onMounted(async () => {
  try {
    const { loginToken } = route.params as { loginToken: string }
    if (!loginToken) return router.replace('/error')

    const { data: res } = await $api.post<ApiResponse<LoginResult>>(
      '/api/userAuth/login-by-token',
      { loginToken }
    )

    console.log('서버 응답:', res) // ✅ 여기서는 정상적으로 찍힘

    if (!res.isSuccess || !res.data?.customToken) {
      alert(res.message)
      return router.replace('/error')
    }

    console.log('커스텀 토큰 : ',res.data.customToken)

    const cred = await signInWithCustomToken($firebaseAuth, res.data.customToken)
        .catch((error) => {
          console.error('Firebase 로그인 실패!');
          console.error('에러 코드:', error.code);
          console.error('에러 메시지:', error.message);
          console.error('에러 상세:', error);
          throw error; // 기존 catch로 던지게
        });
    const target = res.data.customerCompanyActivity
      ? `/${res.data.companyId}/products`
      : `/`
    router.replace(target)

  } catch (error: any) {
    console.error('서버 요청 실패:', error.response?.status, error.response?.data)
    alert('서버 요청 실패')
    router.replace('/error')
  }
})

</script>

<template>
  <div class="p-6 text-center text-lg">
    자동 로그인 중입니다…
  </div>
</template>
