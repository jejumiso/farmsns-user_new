<template>
  <div class="p-6 space-y-4">
    <h2 class="text-lg font-semibold text-center">카드 등록</h2>
<!-- CardRegister.vue 상단 또는 카드번호 입력 위에 삽입 -->
<p class="text-sm text-gray-500 mb-3">
  ※ 탐나는전 카드는 등록이 불가합니다.
</p>

    <p class="text-sm font-medium">카드번호</p>
    <div class="space-y-4">
      <!-- 카드번호 4칸 -->
      <div class="flex gap-1 justify-between">
  <input
    v-model="card1"
    ref="card1Ref"
    maxlength="4"
    class="w-1/4 border border-zinc-300 rounded px-2 py-2 text-center"
    type="text"
    inputmode="numeric"

  />
  <input
    v-model="card2"
    ref="card2Ref"
    maxlength="4"
    class="w-1/4 border border-zinc-300 rounded px-2 py-2 text-center"
    type="text"
    inputmode="numeric"
  />
  <input
    v-model="card3"
    ref="card3Ref"
    maxlength="4"
    class="w-1/4 border border-zinc-300 rounded px-2 py-2 text-center"
    type="text"
    inputmode="numeric"
  />
  <input
    v-model="card4"
    ref="card4Ref"
    maxlength="4"
    class="w-1/4 border border-zinc-300 rounded px-2 py-2 text-center"
    type="text"
    inputmode="numeric"
  />
</div>


      <!-- 유효기간 -->
      <p class="text-sm font-medium">유효기간</p>
      <div class="flex gap-2">
        <input v-model="expMonth" ref="expMonthRef" 
        type="text"
        inputmode="numeric"
         maxlength="2" placeholder="MM" class="w-16 border border-zinc-300 rounded px-3 py-2 text-center" />
        <input v-model="expYear" ref="expYearRef" 
        type="text" 
        inputmode="numeric"
        maxlength="2" placeholder="YY" class="w-16 border border-zinc-300 rounded px-3 py-2 text-center" />
      </div>

      <!-- 신원구분 -->
      <div class="flex items-center gap-2">
        <span class="text-sm">신원구분</span>
        <label class="relative inline-block w-10 h-6">
          <input type="checkbox" v-model="isBiz" class="sr-only peer" />
          <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-zinc-300 rounded-full transition peer-checked:bg-green-500"></span>
          <span class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-4"></span>
        </label>
      </div>

      <!-- 생년월일/사업자번호 -->
      <input
        v-model="idNo"
        ref="idNoRef"
        type="text"
        inputmode="numeric"
       
        :placeholder="isBiz ? '사업자번호 (10자리)' : '생일 (6자리)'"
        :maxlength="isBiz ? 10 : 6"
        :class="[isBiz ? 'w-55' : 'w-40', 'border border-zinc-300 rounded px-3 py-2']"
        class="text-center"
      />


      <!-- 카드 비밀번호 앞 2자리 -->
      <p class="text-sm font-medium">카드 비밀번호 앞 2자리</p>
      <div class="flex items-center gap-2">
        <input v-model="cardPw" ref="cardPwRef" 
        type="text"
        inputmode="numeric"
        maxlength="2" class="w-20 border border-zinc-300 rounded px-3 py-2 text-center" />
        <span class="text-lg">**</span>
      </div>
    </div>

    <!-- 버튼들 -->
    <button class="w-full mt-4 py-3 bg-green-600 text-white rounded hover:bg-green-700" @click="submit">
      다음
    </button>
    <button class="w-full py-2 text-sm text-gray-500" @click="$emit('cancel')">
      취소
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { hashString } from '~/shared-utils/crypto/hash'
interface CardRegisterPayload {
  id: string
  plain: string
  cardNoSuffix: string
}

const emit = defineEmits<{
  (e: 'next', payload: CardRegisterPayload): void
  (e: 'cancel'): void
}>()



const card1 = ref('')
const card2 = ref('')
const card3 = ref('')
const card4 = ref('')
const expMonth = ref('')
const expYear = ref('')
const idNo = ref('')
const cardPw = ref('')
const isBiz = ref(false)

const card1Ref = ref<HTMLInputElement | null>(null)
const card2Ref = ref<HTMLInputElement | null>(null)
const card3Ref = ref<HTMLInputElement | null>(null)
const card4Ref = ref<HTMLInputElement | null>(null)
const expMonthRef = ref<HTMLInputElement | null>(null)
const expYearRef = ref<HTMLInputElement | null>(null)
const idNoRef = ref<HTMLInputElement | null>(null)
const cardPwRef = ref<HTMLInputElement | null>(null)


// 카드번호
watch(card1, (val) => {
  card1.value = filterDigits(val)
  if (card1.value.length >= 4) card2Ref.value?.focus()
})
watch(card2, (val) => {
  card2.value = filterDigits(val)
  if (card2.value.length >= 4) card3Ref.value?.focus()
})
watch(card3, (val) => {
  card3.value = filterDigits(val)
  if (card3.value.length >= 4) card4Ref.value?.focus()
})
watch(card4, (val) => {
  card4.value = filterDigits(val)
  if (card4.value.length >= 4) expMonthRef.value?.focus()
})

// 유효기간
watch(expMonth, (val) => {
  expMonth.value = filterDigits(val)
  if (expMonth.value.length >= 2) expYearRef.value?.focus()
})
watch(expYear, (val) => {
  expYear.value = filterDigits(val)
  if (expYear.value.length >= 2) idNoRef.value?.focus()
})

// 생년월일/사업자번호
watch(idNo, (val) => {
  idNo.value = filterDigits(val)
  const max = isBiz.value ? 10 : 6
  if (idNo.value.length >= max) cardPwRef.value?.focus()
})

// 카드 비밀번호
watch(cardPw, (val) => {
  cardPw.value = filterDigits(val)
})
function filterDigits(str: string) {
  return str.replace(/\D/g, '')
}


function moveNext(val: string, maxLen: number, next: any) {
  if (val.length >= maxLen && next?.focus) {
    next.focus()
  }
}

onMounted(() => {
  card1Ref.value?.focus()
})



function submit() {
  const cardNoFull = card1.value + card2.value + card3.value + card4.value

  if (
    cardNoFull.length === 16 &&
    expMonth.value.length === 2 &&
    expYear.value.length === 2 &&
    idNo.value.length === (isBiz.value ? 10 : 6) &&
    cardPw.value.length === 2
  ) {
    // 유효성 통과 시 입력된 카드 정보만 emit
    const plain = `cardNo=${cardNoFull}&expYear=${expYear.value}&expMonth=${expMonth.value}&idNo=${idNo.value}&cardPw=${cardPw.value}`
    const id = hashString(cardNoFull)
    const cardNoSuffix = card4.value
    emit('next', {
      id,
      plain,
      cardNoSuffix
    })

  } else {
    alert('모든 정보를 정확히 입력해주세요.')
  }
}



</script>

<style scoped>
</style>
