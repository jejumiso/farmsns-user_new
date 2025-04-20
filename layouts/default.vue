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
import { handleCompanyChange } from '~/composables/company/useCompanyChange'

const route = useRoute()

function isActive(path: string) {
  return route.path.endsWith(path)
}

// ✅ 하단 네비게이션을 숨길 경로 조건
const isFullModalPage = computed(() =>
  ['/products/', '/cart','/orders'].some(path => route.path.includes(path))
)
</script>
