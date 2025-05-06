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
        <!-- 헤더 -->
        <div class="flex justify-between items-center text-sm text-gray-600">
          <span class="font-semibold text-gray-800">주문번호 : {{ getDisplayOrderId(order.id) }}</span>
          <span class="text-xs">{{ formatTime(order.dateCreated) }}</span>
        </div>

        <!-- 상품 + 옵션 -->
        <ul class="text-sm text-gray-700 space-y-2 pl-4 list-disc">
          <li v-for="item in order.orderItems" :key="item.productId">
            <div>
              {{ item.productName }} × {{ item.quantity }}
              <div
                v-if="item.options && item.options.length"
                class="text-xs text-gray-500 ml-2 mt-0.5"
              >
                옵션: {{ item.options.map(opt => opt.selectedValue).join(', ') }}
              </div>
            </div>
          </li>
        </ul>

        <!-- 리워드 -->
        <div
          class="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800"
          v-if="order.rewardPointPlanned || order.rewardStampPlanned"
        >
          <p class="font-semibold mb-1">🎉 리워드 적립 완료</p>
          <p v-if="order.rewardPointPlanned > 0">• 포인트: {{ order.rewardPointPlanned.toLocaleString() }}P</p>
          <p v-if="order.rewardStampPlanned > 0">• 스탬프: {{ order.rewardStampPlanned }}개</p>
        </div>

        <!-- 결제 요약 -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 space-y-1">
          <div class="grid grid-cols-2 gap-y-1">
            <span>총 상품 금액</span>
            <span class="text-right">{{ order.cartTotalWithOptions.toLocaleString() }}원</span>
            <span>쿠폰 할인</span>
            <span class="text-right text-red-500">-{{ order.couponDiscountTotal.toLocaleString() }}원</span>
            <span>포인트 사용</span>
            <span class="text-right text-red-500">-{{ order.usedPoint.toLocaleString() }}P</span>
            <span>배송비</span>
            <span class="text-right">{{ order.deliveryFee.toLocaleString() }}원</span>
            <span class="font-semibold">최종 결제 금액</span>
            <span class="text-right font-bold text-black">{{ order.finalAmount.toLocaleString() }}원</span>
          </div>

          <p class="text-xs text-gray-500 mt-2">
            결제 방식: {{ order.paymentMethod }}
            <span
              v-if="order.pgPaidAmount && order.pgPaidAmount > 0"
              class="text-sm text-blue-600"
            >
              : {{ order.pgPaidAmount.toLocaleString() }}원
            </span>
          </p>

          <!-- 무통장 계좌 정보 -->
          <div
            v-if="order.paymentMethod === 'bank' && bankAccount"
            class="mt-3 p-2 border border-dashed border-gray-300 rounded text-sm text-gray-700"
          >
            <div class="flex items-center justify-between gap-2">
              <span>
                💳 {{ bankAccount.bankName }} {{ bankAccount.accountNumber }}
                ({{ bankAccount.accountHolder }})
              </span>
              <button
                @click="copyBankInfo(order)"
                class="text-xs text-blue-600 border border-blue-500 px-2 py-0.5 rounded hover:bg-blue-50"
              >
                복사
              </button>
            </div>
          </div>
        </div>

        <!-- 상태 -->
        <div class="flex justify-end">
          <span
            class="text-xs px-3 py-0.5 rounded-full font-medium"
            :class="statusBadgeClass(order.processStatus)"
          >
            {{ orderStatusLabel(order.processStatus) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 비어있을 때 -->
    <div v-else class="text-center text-gray-400 mt-16 text-sm">
      📭 주문 내역이 없습니다.
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { format, isToday as isTodayFn, subDays, addDays } from 'date-fns'
import { getOrdersByDateService } from '@/services/orders/getOrdersByDateService'
import type { OrderToSave } from '@/shared-types/order/order'
import { useCompanyStore } from '@/stores/company/useCompanyStore'
import { useApi } from '~/composables/useApi'

const companyStore = useCompanyStore()
const companyId = companyStore.currentCompanyId

const selectedDate = ref(new Date())
const orders = ref<OrderToSave[]>([])

// ✅ 기본값 포함한 계좌정보
const bankAccount = computed(() => {
  return companyStore.currentCompany?.bankAccount ?? {
    accountNumber: '000-0000-0000-00',
    accountHolder: '홍길동',
    bankName: '은행명',
  }
})

async function openReceipt(order: OrderToSave) {
  const tid = order.paymentLogs?.find(p => p.type === 'approved')?.tid
  const companyId = order.companyId

  if (!tid || !companyId) {
    alert('영수증 정보를 찾을 수 없습니다.')
    return
  }

  try {
    const { data } = await useApi().get('/api/payment/receipt-url', {
      params: { tid, companyId },
    })

    if (data.isSuccess && data.receiptUrl) {
      window.open(data.receiptUrl, '_blank')
    } else {
      alert('영수증 URL을 가져오지 못했습니다.')
    }
  } catch (error) {
    console.error('📛 영수증 API 호출 실패:', error)
    alert('영수증 확인 중 오류가 발생했습니다.')
  }
}



function copyBankInfo(order: OrderToSave) {
  const text = `${bankAccount.value.bankName} ${bankAccount.value.accountNumber} (${bankAccount.value.accountHolder}) - 입금액: ${order.finalAmount.toLocaleString()}원`
  navigator.clipboard.writeText(text).then(() => {
    
    const toast = useToast()
    console.log('toast : ',JSON.stringify(toast))

    toast.add({
      title: '복사 완료',
      color: 'success', // ✅ 'green' 대신 'success' 사용
    })
  })
}

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
  if (match) return match[1]
  return id.slice(0, 10)
}

async function fetchOrders() {
  if (!companyId) {
    console.warn('❗ 회사 ID가 없습니다.')
    return
  }
  const searchDate = Number(format(selectedDate.value, 'yyyyMMdd'))
  const res = await getOrdersByDateService(companyId, searchDate)
  if (res.isSuccess) {
    orders.value = res.data ?? []
  } else {
    orders.value = []
    console.warn('❗ 주문 불러오기 실패:', res.message)
  }
}

watch(selectedDate, fetchOrders)
onMounted(fetchOrders)
</script>
