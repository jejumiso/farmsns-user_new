<!-- 📁 components/payment/PasswordPad.vue -->
<template>
  <div class="p-6 flex flex-col items-center justify-center space-y-6">
    <h2 class="text-xl font-semibold">
      {{ title || (step === 2 ? '비밀번호 재입력' : '비밀번호 입력') }}
    </h2>

    <!-- 입력된 비밀번호 표시 -->
    <div class="flex gap-2">
      <div
        v-for="i in 6"
        :key="i"
        class="w-4 h-4 rounded-full border border-zinc-400"
        :class="{ 'bg-black': password.length >= i }"
      ></div>
    </div>

    <!-- 숫자 키패드 -->
    <div class="grid grid-cols-3 gap-4 text-center text-lg font-semibold">
      <button
        v-for="n in numberButtons"
        :key="n"
        class="p-4 bg-zinc-100 rounded-full hover:bg-zinc-200"
        @click="appendDigit(n)"
      >
        {{ n }}
      </button>
      <div></div>
      <button
        class="p-4 bg-zinc-100 rounded-full hover:bg-zinc-200"
        @click="appendDigit(0)"
      >0</button>
      <button
        class="p-4 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
        @click="backspace"
      >⌫</button>
    </div>

    <div class="flex gap-2 w-full">
      <button
        class="mt-4 flex-1 py-3 min-w-[120px] rounded-md text-white font-semibold bg-gray-400 hover:bg-gray-500"
        @click="emit('back')"
        v-if="step === 2"
      >
        이전
      </button>

      <button
        :disabled="password.length !== 6"
        class="mt-4 flex-1 py-3 min-w-[120px] rounded-md text-white font-semibold text-center"
        :class="password.length === 6 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'"
        @click="submit"
      >
        {{ step === 2 ? '확인' : '확인' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  step: 1 | 2
  title?: string
  firstInput?: string
}>()

const emit = defineEmits<{
  (e: 'confirm', value: string): void
  (e: 'fail', message?: string): void
  (e: 'back'): void
}>()

const password = ref('')
const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function appendDigit(n: number) {
  if (password.value.length < 6) {
    password.value += n.toString()
  }
}

function backspace() {
  password.value = password.value.slice(0, -1)
}

function submit() {
  if (password.value.length === 6) {
    if (props.step === 2 && props.firstInput !== undefined) {
      if (props.firstInput !== password.value) {
        alert('비밀번호가 일치하지 않습니다.')
        emit('fail', '비밀번호가 다릅니다.')
        password.value = ''
        return
      }
    }
    emit('confirm', password.value)
  }
}
</script>

<style scoped>
button {
  transition: all 0.2s;
}
</style>