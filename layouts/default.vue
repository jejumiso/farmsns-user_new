<template>
  <div class="min-h-screen pb-16 bg-white">
    <!-- 콘텐츠 영역 -->
    <NuxtPage />

    <!-- ✅ 하단 고정 네비게이션 (특정 경로에서는 숨김) -->
    <nav
      v-if="!isFullModalPage"
      class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm z-50"
    >
      <ul class="flex justify-around text-sm text-gray-600">
        <li>
          <NuxtLink
            to="/farmsns"
            class="flex flex-col items-center justify-center py-2"
            :class="{ 'text-green-600 font-bold': isActive('/') }"
          >
            <span>🏠</span>
            <span>홈</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/farmsns/orders"
            class="flex flex-col items-center justify-center py-2"
            :class="{ 'text-green-600 font-bold': isActive('/orders') }"
          >
            <span>📦</span>
            <span>주문내역</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/farmsns/mypage"
            class="flex flex-col items-center justify-center py-2"
            :class="{ 'text-green-600 font-bold': isActive('/mypage') }"
          >
            <span>👤</span>
            <span>MY</span>
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
watch(
  () => [route.params.companyId, authStore.currentUser?.uid],
  ([companyId, uid]) => {
    if (typeof companyId === 'string' && uid) {
      console.log('💡 회사 또는 유저 변경 감지:', companyId)
      handleCompanyChange(authStore.currentUser?.uid, companyId)
    }
  },
  { immediate: true }
)


function isActive(path: string) {
  return route.path.endsWith(path)
}

// ✅ 하단 네비게이션을 숨길 경로 조건
const isFullModalPage = computed(() => {
  const segments = route.path.split('/').filter(Boolean)

  // 상품 상세: /products/{id}
  if (segments.includes('products') && segments.length > segments.indexOf('products') + 1) {
    return true
  }

  // 카트나 주문 페이지: cart / order 하위
  if (segments.includes('cart') || segments.includes('order')) {
    return true
  }

  // 마이페이지 주소 관리
  if (segments.includes('mypage') && segments.includes('address')) {
    return true
  }

  return false
})




</script>
