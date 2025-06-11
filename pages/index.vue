<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 class="text-2xl font-bold mb-6">🐥 일반이용자는 루트에 접근할 수 없고</h1>
    <h1 class="text-2xl font-bold mb-6">나이스페이</h1>
    <h1 class="text-2xl font-bold mb-6">심사중에만 오픈하였습니다.</h1>
    일반 이용자는 카톡 링크를 통해서만 주문가능. 아래는 그 링크의 예시.<br /><br />

    카톡 링크는 매장 방문자에 한해 본인의 요청으로 발송 됩니다.

    <!-- <NuxtLink
      to="/farmsns"
      class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mb-4"
    >
      farmsns 매장 보기
    </NuxtLink> -->

    <!-- <NuxtLink
  to="/token/666722aee1728623ddb406c4f4233da5920a1a4e3ab7fcc561449f957996e061"
  class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
>
  자동 로그인 테스트(2111)
</NuxtLink> -->

 <NuxtLink
  to="/token/a9b7d0363189290146add9cb6eea66905566014a4f2731f28ebe9ca529a5a76d"
  class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
>
  자동 로그인 테스트(010-1234-1234)
</NuxtLink>

 <NuxtLink
  to="/token/a9b7d0363189290146add9cb6eea66905566014a4f2731f28ebe9ca529a5a76d?friendtalkCode=friendtalk0001"
  class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
>
  자동 로그인 테스트(010-1234-1234) / 플친
</NuxtLink>

<!--<NuxtLink
  to="/token/666722aee1728623ddb406c4f4233da5920a1a4e3ab7fcc561449f957996e061/mypage"
  class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
>
  자동 로그인 테스트 - 마이페이지(2111)
</NuxtLink> -->


    <!-- 🔥 모든 캐시 삭제 버튼 -->
    <!-- <button
      @click="clearAllCaches"
      class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
    >
      모든 캐시 삭제
    </button> -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
import { clearAllCompanyCaches } from '@/utils/cache/companyCache'

function clearAllCaches() {
  clearAllCompanyCaches()
  alert('✅ 모든 캐시가 삭제되었습니다.')
}
</script>
