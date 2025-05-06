<template>
  <div class="flex min-h-screen items-center justify-center bg-white">
    <div class="text-center space-y-4">
      <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto" />
      <p class="text-gray-700 text-lg font-medium">로딩 중입니다...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { signInWithCustomToken } from 'firebase/auth'
import { useNuxtApp } from '#app'
import type { ApiResponse } from '@/shared-types/apiResponse'
import type { CustomerProfile } from '~/shared-types/customer-profile/customerProfile'
import type { CustomerCompanyActivity } from '~/shared-types/customer-company-activity/customerCompanyActivity'

definePageMeta({
  layout: false,
})

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
  const { loginToken, redirect } = route.params as {
    loginToken: string
    redirect?: string | string[]
  }

  if (!loginToken) return router.replace('/error')

  const { data: res } = await $api.post<ApiResponse<LoginResult>>(
    '/api/userAuth/login-by-token',
    { loginToken }
  )

  if (!res.isSuccess || !res.data?.customToken) {
    alert(res.message)
    return router.replace('/error')
  }

  await signInWithCustomToken($firebaseAuth, res.data.customToken)

  // redirect 세그먼트를 배열로 정리
  const segs = redirect == null
    ? []
    : Array.isArray(redirect)
      ? redirect
      : [redirect]

  let target: string

  if (segs.length) {
    target = '/' + segs.join('/')
    target = res.data.companyId
      ? `/${res.data.companyId}${target}`
      : `${target}`

    // ✅ replace로 token 경로 제거
    await router.replace(`/${res.data.companyId}/${segs[0]}`)

    // ✅ push로 최종 목적지로 이동 (뒤로 가기 시 1차로 돌아옴)
    router.push(target)
  } else {
    // 기본 경로 처리
    target = res.data.companyId
      ? `/${res.data.companyId}/products`
      : `/`
    router.replace(target)
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
