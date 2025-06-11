<!-- 📁 pages/token/[loginToken]/]index.vue -->

<template>
  <div class="flex min-h-screen items-center justify-center bg-white">
    <div class="text-center space-y-4">
      <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto" />
      <p class="text-gray-700 text-lg font-medium">로딩 중입니다...</p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted }            from 'vue'
import { useRoute, useRouter }  from 'vue-router'
import { signInWithCustomToken } from 'firebase/auth'
import { useNuxtApp }           from '#app'
import { useUserAuthStore }     from '@/stores/userAuth/useUserAuthStore'
import type { ApiResponse }     from '@/shared-types/apiResponse'
import type { CustomerProfile } from '~/shared-types/customer-profile/customerProfile'
import type { CustomerCompanyActivity } from '~/shared-types/customer-company-activity/customerCompanyActivity'

definePageMeta({
  layout: false,
})
const userAuthStore = useUserAuthStore()

interface LoginResult {
  customToken: string
  companyId: string
  friendtalkReceiver?: boolean // ✅ 선택적으로 추가 (값이 없을 수도 있으므로 `?`)
}


const route = useRoute()
const router = useRouter()
const { $firebaseAuth, $api } = useNuxtApp()

onMounted(async () => {
  try {
    const { loginToken } = route.params as { loginToken: string }
    if (!loginToken) return router.replace('/error')

    const friendtalkCode = route.query.friendtalkCode as string
    const requestBody: Record<string, any> = {
      loginToken,
    }
    if (friendtalkCode) {
      console.log(`📨 친구톡 코드 수신: ${friendtalkCode}`)
      requestBody.friendtalkCode = friendtalkCode
      userAuthStore.setFriendtalkAttempted(true)
    }

    const { data: res } = await $api.post<ApiResponse<LoginResult>>(
      '/api/userAuth/login-by-token',
      requestBody
    )

    console.log('서버 응답:', res) // ✅ 여기서는 정상적으로 찍힘

    if (!res.isSuccess || !res.data?.customToken) {
      alert(res.message)
      return router.replace('/error')
    }

    console.log('커스텀 토큰 : ',res.data.customToken)
    console.log('커스텀 회사 ID : ',res.data.companyId)

    const cred = await signInWithCustomToken($firebaseAuth, res.data.customToken)
        .catch((error) => {
          console.error('Firebase 로그인 실패!');
          console.error('에러 코드:', error.code);
          console.error('에러 메시지:', error.message);
          console.error('에러 상세:', error);
          throw error; // 기존 catch로 던지게
        });
    
    userAuthStore.setFriendtalkReceiver(res.data.friendtalkReceiver === true)
    const target = res.data.companyId
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


<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>