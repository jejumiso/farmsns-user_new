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
            <p class="text-sm text-gray-500">**** **** **** {{ card.cardNoSuffix }}</p>
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
  import { registerNiceCard } from '~/services/payment/registerNiceCardService'
  import { useCompanyStore } from '@/stores/company/useCompanyStore'
import { hashString } from '~/shared-utils/crypto/hash'
import type { RegisterNiceCardInput } from '~/shared-types/nicepay/RegisterNiceCardInput'
import type { ProfileCardInfo } from '~/shared-types/nicepay/ProfileCardInfo'
  import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import { decryptWithIv } from '~/shared-utils/crypto/decryption'
import type { ApiResponse } from '~/shared-types/apiResponse'
import type { RegisterNiceCardResult } from '~/shared-types/nicepay/RegisterNiceCardResult'
import { saveRegisteredCard } from '~/services/payment/saveRegisteredCardService'
import type { CardBidInfo } from '~/shared-types/nicepay/CardBidInfo'
  const companyStore = useCompanyStore()
  const props = defineProps<{ orderId: string; amount: number; clientId: string }>()
  const emit = defineEmits(['close'])
  
  const viewState = ref<'list' | 'register' | 'pw1' | 'pw2' | 'password'>('list')

  const cards = ref<ProfileCardInfo[]>([])
  const profile = useUserAuthStore().customerProfile
  if (profile?.cards) {
    cards.value = Object.values(profile.cards) as ProfileCardInfo[]
  }

  const selectedCard = ref<any>(null)
  const firstPassword = ref('')
  const savedCardInfo = ref<ProfileCardInfo | null>(null)
  const savedBid = ref<CardBidInfo | null>(null)

  
  function selectCard(card: ProfileCardInfo) {
    selectedCard.value = card
    viewState.value = 'password'
  }
  
  function onPasswordEntered(pw: string) {
    console.log('결제 시도:', props.orderId, props.amount, pw)
    emit('close')
  }
  
  interface CardFormPayload {
    id: string
    plain: string
    cardNoSuffix: string  
}

const isSubmitting = ref(false)

async function onCardFormSubmitted({ id, plain,cardNoSuffix }: CardFormPayload) {
  if (isSubmitting.value) return
  isSubmitting.value = true
    if(profile === null || profile.iv === null) {
      alert('프로필 정보가 없습니다.')
      isSubmitting.value = false

      return
    }
    const res :ApiResponse<RegisterNiceCardResult> = await registerNiceCard(companyStore.currentCompanyId!, plain)
  
    if (!res.isSuccess || !res.data) {
      alert('카드 등록에 실패했습니다.' + res.message)
      isSubmitting.value = false

      // viewState.value = 'list'
      return
    }
  
    savedCardInfo.value = {
      id,
      cardName: res.data.cardName,
      cardCode: res.data.cardCode,
      cardPlainText : decryptWithIv( plain,profile.iv),
      cardNoSuffix: cardNoSuffix,
      authDate: res.data.authDate,
      password:''
    }
    savedBid.value = {
      id,
      bid : res.data.bid,
      authDate: res.data.authDate
    }

  
    viewState.value = 'pw1'
    isSubmitting.value = false

  }
  
  function onFirstPasswordEntered(pw: string) {
    firstPassword.value = pw
    viewState.value = 'pw2'
  }
  
  async function registerCard(pw: string) {
    if (!savedCardInfo.value) {
      alert('카드 정보가 없습니다.')
      return
    }
  
    const passwordHash = hashString(pw)
  
    // TODO: save to DB here (call saveCardToProfile or emit to parent)
    //savedCardInfo,
    //savedBid
    await saveRegisteredCard(
      companyStore.currentCompanyId!,
      {
        ...savedCardInfo.value!,
        password:   passwordHash,
      },
      {
        ...savedBid.value!
      }
    )

  
    cards.value.push({
      id: savedCardInfo.value.id,
      cardPlainText: savedCardInfo.value.cardPlainText,
      cardNoSuffix: savedCardInfo.value.cardNoSuffix,
      cardName: savedCardInfo.value.cardName,
      cardCode: savedCardInfo.value.cardCode,
      authDate: savedCardInfo.value.authDate,
      password: passwordHash
    })


  
    viewState.value = 'list'
  }
  </script>
  

  
  <style scoped>
  </style>