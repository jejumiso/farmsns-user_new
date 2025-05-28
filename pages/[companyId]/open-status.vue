<template>
  <div class="min-h-screen bg-[#fefae0] flex items-center justify-center px-4 py-10">
    <div class="bg-white shadow-xl rounded-3xl px-6 py-8 max-w-md w-full text-center space-y-5 border border-amber-200 animate-fade-in">
      
      <!-- ☕ 상단 아이콘 -->
      <div class="text-5xl animate-wiggle">☕</div>

      <!-- ✅ 운영 여부 메시지 -->
      <h1 class="text-3xl font-extrabold tracking-wide" :class="isOpen ? 'text-green-600' : 'text-red-500'">
        {{ isOpen ? '🟢 OPEN' : '🔴 CLOSED' }}
      </h1>

      <!-- 영업 상태 안내 -->
      <div
        class="rounded-lg px-4 py-3 text-sm text-center shadow-sm border font-medium"
        :class="isOpen
          ? 'bg-green-50 text-green-700 border-green-100'
          : 'bg-gray-100 text-gray-500 border-gray-200'"
        v-html="openMessage"
      ></div>

      <!-- ☕ 재미있는 서브 문구 -->
      <p class="text-sm text-stone-500 italic">
        {{ isOpen ? '☕ 카페인 충전 하러 오세요 ' : '카페인 충전은 내일로 미뤄요 😴' }}
      </p>

      <!-- ☕ 버튼: 열었을 때만 -->
      <div v-if="isOpen">
        <button
          @click="goToProducts"
          class="w-full py-3 bg-green-500 text-white font-bold rounded-xl shadow-md hover:bg-green-600 transition-all duration-200"
        >
          지금 커피 보러 가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/company/useCompanyStore'
import { getNextOpenMessage } from '~/utils/businessHours'
const router = useRouter()
const companyStore = useCompanyStore()


const currentCompany = computed(() => companyStore.currentCompany)
const isOpen = computed(() => currentCompany.value?.isOpen ?? false)

const openMessage = computed(() => {
  if (isOpen.value) {
    return '✅ 영업중입니다. 많은 이용 부탁드립니다!'
  }

  const businessHours = currentCompany.value?.businessHours
  return businessHours
    ? getNextOpenMessage(businessHours)
    : '⛔️ 영업 시간이 설정되지 않았습니다.'
})

const companyId = computed(() => companyStore.currentCompany?.id || '')

function goToProducts() {
  router.push(`/${companyId.value}/products`)
}
</script>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out both;
}

@keyframes wiggle {
  0%, 100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-4deg);
  }
  75% {
    transform: rotate(4deg);
  }
}
.animate-wiggle {
  animation: wiggle 2.4s ease-in-out infinite;
}
</style>
