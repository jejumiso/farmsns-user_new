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
    return router.replace('/error')
  }

  const cred = await signInWithCustomToken($firebaseAuth, res.data.customToken)
  const authStore = useUserAuthStore()
  authStore.setFirebaseUser(cred.user)
  authStore.setUser({
    customerProfile: res.data.customerProfile,
    customerCompanyActivity: res.data.customerCompanyActivity,
  })

  // redirect 세그먼트를 배열로 정리
  const segs = redirect == null
    ? []
    : Array.isArray(redirect)
      ? redirect
      : [redirect]

  let target: string
  if (segs.length) {
    target = '/' + segs.join('/')
    target = res.data.customerCompanyActivity
      ? `/${res.data.companyId}${target}`
      : `${target}`


  } else {
    target = res.data.customerCompanyActivity
      ? `/${res.data.companyId}/products`
      : `/`
  }
  router.replace(target)
})
</script>

<template>
  <div class="p-6 text-center text-lg">
    리다이렉트 자동 로그인 중입니다…
  </div>
</template>
