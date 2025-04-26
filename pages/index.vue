<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 class="text-2xl font-bold mb-6">🐥 Welcome to FarmSNS</h1>

    <NuxtLink
      to="/farmsns"
      class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mb-4"
    >
      farmsns 매장 보기
    </NuxtLink>

    <NuxtLink
  to="/token/5bc9011890cbbc75fb3794f8e49c4cff54eb5fe429fbf937a4842720d1fcc81f"
  class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
>
  자동 로그인 테스트
</NuxtLink>

<NuxtLink
  to="/token/5bc9011890cbbc75fb3794f8e49c4cff54eb5fe429fbf937a4842720d1fcc81f/mypage"
  class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
>
  자동 로그인 테스트 - 마이페이지
</NuxtLink>


    <!-- 🔥 모든 캐시 삭제 버튼 -->
    <button
      @click="clearAllCaches"
      class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
    >
      모든 캐시 삭제
    </button>
  </div>
</template>

<script setup lang="ts">
import { clearAllCompanyCaches } from '@/utils/cache/companyCache'

function clearAllCaches() {
  clearAllCompanyCaches()
  alert('✅ 모든 캐시가 삭제되었습니다.')
}
</script>
