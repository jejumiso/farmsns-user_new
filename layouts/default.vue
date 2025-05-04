<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-1 overflow-y-auto pb-20">
      <!-- 콘텐츠 영역 -->
      <NuxtPage />
    </div>

    <!-- ✅ 하단 고정 네비게이션 (특정 경로에서는 숨김) -->
    <nav
  v-if="!isFullModalPage"
  class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50"
>
<ul class="flex text-xs text-gray-400">
  <li v-for="item in navItems" :key="item.to" class="flex-1">
    <NuxtLink
      :to="`/${companyId}${item.to}`"
      class="flex flex-col items-center justify-center gap-0.5 py-2 px-3 w-full h-full transition"
      :class="(
        isActive(item.to)
          ? 'bg-green-600 text-white font-bold shadow-md'
          : 'hover:text-white'
      )"
    >
      <span class="text-xl">{{ item.icon }}</span>
      <span class="text-[11px]">{{ item.label }}</span>
    </NuxtLink>
  </li>
</ul>

</nav>


  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { handleCompanyChange } from '@/composables/company/useCompanyChange'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'

const route = useRoute()
const authStore = useUserAuthStore()

const companyId = computed(() => route.params.companyId as string || '')

watch(
  () => [route.params.companyId, authStore.currentUser?.uid],
  ([companyId, uid]) => {
    if (typeof companyId === 'string' && uid) {
      console.log('💡 회사 또는 유저 변경 감지 회사ID:', companyId)
      handleCompanyChange(authStore.currentUser?.uid, companyId)
    }
  },
  { immediate: true }
)

const navItems = [
  { to: '/products', icon: '🏠', label: '홈' },
  { to: '/orders', icon: '📦', label: '주문내역' },
  { to: '/mypage', icon: '👤', label: 'MY' },
]

function isActive(path: string) {
  return route.path.startsWith(`/${companyId.value}${path}`)
}

const isFullModalPage = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  if (segments.includes('products') && segments.length > segments.indexOf('products') + 1) return true
  if (segments.includes('cart') || segments.includes('order')) return true
  if (segments.includes('mypage') && segments.includes('address')) return true
  return false
})
</script>

