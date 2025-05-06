<template>
  <div class="min-h-screen bg-[#fefae0] flex items-center justify-center px-4 py-10">
    <div class="bg-white shadow-xl rounded-3xl px-6 py-8 max-w-md w-full text-center space-y-5 border border-amber-200 animate-fade-in">
      
      <!-- ☕ 상단 아이콘 -->
      <div class="text-5xl animate-wiggle">☕</div>

      <!-- ✅ 운영 여부 메시지 -->
      <h1 class="text-3xl font-extrabold tracking-wide" :class="isOpen ? 'text-green-600' : 'text-red-500'">
        {{ isOpen ? '🟢 OPEN' : '🔴 CLOSED' }}
      </h1>

      <p class="text-stone-700 text-base font-medium">
        {{ isOpen ? '문 열었어요!' : '오늘은 쉽니다. 내일 만나요!' }}
      </p>

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

const companyStore = useCompanyStore()
const router = useRouter()

const isOpen = computed(() => {
  return companyStore.currentCompany?.isOpen ?? false
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
