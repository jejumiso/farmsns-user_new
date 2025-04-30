<!-- 📁 components/payment/CardSliderModal.vue -->
<template>
    <div class="fixed inset-0 bg-white z-50 p-4 overflow-y-auto">
      <!-- 카드 목록 -->
      <div v-if="viewState === 'list'">
        <h2 class="text-lg font-semibold mb-4">간편결제 카드 선택</h2>
        <div class="flex overflow-x-auto gap-4 pb-4">
          <div
            v-for="card in cards"
            :key="card.id"
            class="w-4/5 shrink-0 p-4 border rounded-xl bg-gray-50"
            @click="selectCard(card)"
          >
            <p class="font-medium">{{ card.cardName }}</p>
            <p class="text-sm text-gray-500">**** **** **** {{ card.cardNumber.slice(-4) }}</p>
          </div>
          <div
            class="w-4/5 shrink-0 p-4 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-500 cursor-pointer"
            @click="viewState = 'register'"
          >
            + 카드 등록하기
          </div>
        </div>
      </div>
  
      <!-- 카드 등록 화면 -->
      <CardRegister
        v-if="viewState === 'register'"
        @next="onCardFormSubmitted"
        @cancel="viewState = 'list'"
      />
  
      <!-- 비밀번호 1차 입력 -->
      <PasswordPad
        v-if="viewState === 'pw1'"
        :step="1"
        @confirm="onFirstPasswordEntered"
        @back="viewState = 'register'"
      />
  
      <!-- 비밀번호 2차 입력 -->
      <PasswordPad
        v-if="viewState === 'pw2'"
        :step="2"
        :first-input="firstPassword"
        @confirm="registerCard"
        @fail="viewState = 'pw1'"
        @back="viewState = 'pw1'"
      />
  
      <!-- 결제 비밀번호 입력 -->
      <PasswordPad
        v-if="viewState === 'password' && selectedCard"
        :step="1"
        @confirm="onPasswordEntered"
        @back="viewState = 'list'"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import PasswordPad from './PasswordPad.vue'
  import CardRegister from './CardRegister.vue'
  
  const props = defineProps<{ orderId: string; amount: number; clientId: string }>()
  const emit = defineEmits(['close'])
  
  const viewState = ref<'list' | 'register' | 'pw1' | 'pw2' | 'password'>('list')
  const cards = ref<any[]>([]) // 등록된 카드 목록
  const selectedCard = ref<any>(null)
  const firstPassword = ref('')
  const savedCardInfo = ref<any>(null)
  
  function selectCard(card: any) {
    selectedCard.value = card
    viewState.value = 'password'
  }
  
  function onPasswordEntered(pw: string) {
    // 여기에 결제 API 호출
    console.log('결제 시도:', props.orderId, props.amount, pw)
    emit('close')
  }
  
  function onCardFormSubmitted(cardInfo: any) {
    savedCardInfo.value = cardInfo
    viewState.value = 'pw1'
  }
  
  function onFirstPasswordEntered(pw: string) {
    firstPassword.value = pw
    viewState.value = 'pw2'
  }
  
  function registerCard(pw: string) {
    // 카드 등록 API 호출
    console.log('카드 등록:', savedCardInfo.value, pw)
    viewState.value = 'list'
    cards.value.push({
      ...savedCardInfo.value,
      cardNumber: savedCardInfo.value.cardNumber || '1234123412345678',
      id: Date.now().toString(),
      cardName: savedCardInfo.value.cardName || '신용카드'
    })
  }
  </script>
  
  <style scoped>
  </style>