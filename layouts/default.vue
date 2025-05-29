<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <div :class="['flex-1 overflow-y-auto', isFakeMode ? 'pb-[280px]' : 'pb-[100px]']">
      <!-- 콘텐츠 영역 -->
      <NuxtPage />
    </div>

    <!-- ✅ 하단 고정: 회사 정보 + 네비게이션 -->
    <div
      v-if="!isFullModalPage"
      class="fixed bottom-0 left-0 right-0 z-40"
    >
      <!-- 회사 정보 (fake 모드일 때만 표시) -->
      <div
        v-if="isFakeMode"
        class="bg-gray-800 text-gray-300 text-xs px-4 py-2 border-t border-gray-700"
      >
        <div>회사 : 카페봄봄 남원점 / 사업자등록번호 : 384-09-02194</div>
        <div>대표 : 현재영 / 통신판매업신고 : 2025-제주남원-0029</div>        
        <div>주소 : 제주도 서귀포시 남한로 8 1층 카페봄봄</div>
        <div>전화 : 064-900-9200 / 이메일 : itsjeju@naver.com</div>
        <div>개인정보관리자 : 현재영</div>
        <div>개인정보(연락처, 주소)는 암호화(AES-256)  됩니다</div>
        <div class="text-xs text-gray-400 flex justify-center gap-4 mt-4">
          <NuxtLink :to="`/${companyId}/terms`" class="hover:underline">약관확인</NuxtLink>
          <NuxtLink :to="`/${companyId}/privacy`" class="hover:underline">개인정보처리방침 확인</NuxtLink>
        </div>

      </div>

      <!-- 네비게이션 -->
      <nav class="bg-gray-900 border-t border-gray-800">
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
              <span class="text-xl leading-none">{{ item.icon }}</span>
              <span class="text-[11px]">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

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

// ✅ 이모지 기반 메뉴 구성
const navItems = [
  { to: '/products', icon: '🎁', label: '상품목록' },
  { to: '/orders', icon: '🚚', label: '주문내역' },
  { to: '/mypage', icon: '🙋', label: 'MY' },
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

const isFakeMode = computed(() => {return authStore.customerProfile?.roles?.includes('fake') ?? false})

</script>
