<!-- 📁 components/payment/CardRegister.vue -->
<template>
  <div class="p-6 space-y-4">
    <h2 class="text-lg font-semibold text-center">카드 등록</h2>

    <div class="space-y-2">
      <input v-model="cardNo" placeholder="카드번호" class="w-full border border-zinc-300 rounded px-3 py-2" maxlength="16" />
      <div class="flex gap-2">
        <input v-model="expMonth" placeholder="MM" class="w-full border border-zinc-300 rounded px-3 py-2 w-1/2" maxlength="2" />
        <input v-model="expYear" placeholder="YY" class="w-full border border-zinc-300 rounded px-3 py-2 w-1/2" maxlength="2" />
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm">신원구분</span>
        <label class="relative inline-block w-10 h-6">
          <input type="checkbox" v-model="isBiz" class="sr-only peer" />
          <span class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-zinc-300 rounded-full transition peer-checked:bg-green-500"></span>
          <span class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-4"></span>
        </label>
      </div>

      <input
        v-model="idNo"
        :placeholder="isBiz ? '사업자번호 (10자리)' : '생년월일 (6자리)'"
        class="w-full border border-zinc-300 rounded px-3 py-2"
        :maxlength="isBiz ? 10 : 6"
      />
      <input v-model="cardPw" placeholder="카드 비밀번호 앞 2자리" class="w-full border border-zinc-300 rounded px-3 py-2" maxlength="2" />
    </div>

    <button
      class="w-full mt-4 py-3 bg-green-600 text-white rounded hover:bg-green-700"
      @click="submit"
    >
      다음
    </button>

    <button class="w-full py-2 text-sm text-gray-500" @click="$emit('cancel')">
      취소
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'next', payload: CardRegisterPayload): void
  (e: 'cancel'): void
}>()

interface CardRegisterPayload {
  cardNo: string
  expMonth: string
  expYear: string
  idNo: string
  cardPw: string
  isBiz: boolean
}

const cardNo = ref('')
const expMonth = ref('')
const expYear = ref('')
const idNo = ref('')
const cardPw = ref('')
const isBiz = ref(false)

function submit() {
  if (
    cardNo.value.length === 16 &&
    expMonth.value.length === 2 &&
    expYear.value.length === 2 &&
    idNo.value.length === (isBiz.value ? 10 : 6) &&
    cardPw.value.length === 2
  ) {
    emit('next', {
      cardNo: cardNo.value,
      expMonth: expMonth.value,
      expYear: expYear.value,
      idNo: idNo.value,
      cardPw: cardPw.value,
      isBiz: isBiz.value,
    })
  } else {
    alert('모든 정보를 정확히 입력해주세요.')
  }
}
</script>

<style scoped>
</style>