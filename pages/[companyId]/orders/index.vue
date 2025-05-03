<!-- 📁 pages/[companyId]/orders/index.vue -->
<template>
  <div class="p-4 max-w-xl mx-auto space-y-6 bg-gray-50 min-h-screen">
    <!-- 날짜 선택 -->
    <div class="flex justify-center items-center gap-6 text-sm">
      <button @click="goToPrevDay" class="text-2xl px-2 text-gray-600 hover:text-black">‹</button>
      <span class="font-semibold text-base">
        {{ isToday(selectedDate) ? '오늘' : formatDate(selectedDate) }}
      </span>
      <button
        @click="goToNextDay"
        :disabled="isToday(selectedDate)"
        class="text-2xl px-2 text-gray-400 disabled:opacity-30"
      >
        ›
      </button>
    </div>

    <!-- 주문 목록 -->
    <div v-if="orders.length" class="space-y-5">
      <div
        v-for="order in orders"
        :key="order.id"
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3"
      >
        <!-- 주문 헤더 -->
        <div class="flex justify-between items-center text-sm text-gray-600">
          <span class="font-semibold text-gray-800">#{{ getDisplayOrderId(order.id) }}</span>
          <span class="text-xs">{{ formatTime(order.dateCreated) }}</span>
        </div>

        <!-- 상품 목록 -->
        <ul class="text-sm text-gray-700 space-y-1 pl-4 list-disc">
          <li v-for="item in order.orderItems" :key="item.productId">
            {{ item.productName }} × {{ item.quantity }}
          </li>
        </ul>

        <!-- 금액 및 상태 -->
        <div class="flex justify-between items-center mt-2">
          <span class="text-sm font-mono text-gray-800">
            {{ order.finalAmount.toLocaleString() }}원
          </span>
          <span
            class="text-xs px-3 py-0.5 rounded-full font-medium"
            :class="statusBadgeClass(order.processStatus)"
          >
            {{ orderStatusLabel(order.processStatus) }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-400 mt-16 text-sm">
      📭 주문 내역이 없습니다.
    </div>
  </div>
</template>

  
  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { format, isToday as isTodayFn, subDays, addDays } from 'date-fns'
  import { getOrdersByDateService } from '@/services/orders/getOrdersByDateService'
  import type { OrderToSave } from '@/shared-types/order/order'
  import { useCompanyStore } from '@/stores/company/useCompanyStore'; // authStore 가져오기
  const companyId = useCompanyStore().currentCompanyId
  
  const selectedDate = ref(new Date())
  const orders = ref<OrderToSave[]>([])
  
  const isToday = (date: Date) => isTodayFn(date)
  const formatDate = (date: Date) => format(date, 'MM월 dd일')

const formatTime = (ts: { seconds: number; nanoseconds: number } | null | undefined): string => {
  try {
    if (!ts || typeof ts.seconds !== 'number') return '시간 없음'
    const date = new Date(ts.seconds * 1000)
    return isNaN(date.getTime()) ? '시간 없음' : format(date, 'HH:mm')
  } catch {
    return '시간 없음'
  }
}


  
  function goToPrevDay() {
    selectedDate.value = subDays(selectedDate.value, 1)
  }
  
  function goToNextDay() {
    if (!isToday(selectedDate.value)) {
      selectedDate.value = addDays(selectedDate.value, 1)
    }
  }
  
  function orderStatusLabel(status: OrderToSave['processStatus']) {
    const map: Record<OrderToSave['processStatus'], string> = {
      waitingConfirm: '접수 대기',
      ordered: '주문 접수됨',
      cooking: '조리 중',
      ready: '조리 완료',
      waitingPickup: '픽업 대기',
      delivering: '배달 중',
      delivered: '배달 완료',
      completed: '완료됨',
      cancelled: '취소됨',
    }
    return map[status] ?? '알 수 없음'
  }
  
  async function fetchOrders() {
    if (!companyId) {
      console.warn('❗ 회사 ID가 없습니다.')
      return
    }
    const searchDate = Number(format(selectedDate.value, 'yyyyMMdd')) // ✅ 숫자 변환 포함

    const res = await getOrdersByDateService(companyId, searchDate)
    if (res.isSuccess) {
      orders.value = res.data??[]
    } else {
      orders.value = []
      console.warn('❗ 주문 불러오기 실패:', res.message)
    }
  }
  function statusBadgeClass(status: OrderToSave['processStatus']) {
  const base = 'bg-gray-100 text-gray-600'

  const map: Record<OrderToSave['processStatus'], string> = {
    waitingConfirm: 'bg-yellow-100 text-yellow-800',
    ordered: 'bg-blue-100 text-blue-800',
    cooking: 'bg-orange-100 text-orange-800',
    ready: 'bg-indigo-100 text-indigo-800',
    waitingPickup: 'bg-green-100 text-green-800',
    delivering: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-200 text-green-900',
    completed: 'bg-gray-200 text-gray-800',
    cancelled: 'bg-red-100 text-red-700',
  }

  return map[status] || base
}

function getDisplayOrderId(id: string | undefined): string {
  if (!id) return '주문ID없음'

  const match = id.match(/^ord_(\d{17})_/)
  if (match) {
    return match[1] // 정규식 그룹으로 17자리 추출
  }

  return id.slice(0, 10) // fallback: 앞의 10자
}


  watch(selectedDate, fetchOrders)
  onMounted(fetchOrders)
  </script>
  
  <style scoped>
  button:disabled {
    cursor: not-allowed;
  }
  </style>
  