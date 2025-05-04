<!-- 📁 components/payment/CardSliderModal.vue -->
<template>
  <div class="fixed inset-0 bg-white z-50 p-4 overflow-y-auto">
    <!-- 카드 목록 -->
    <div v-if="viewState === 'list'">
      <h2 class="text-lg font-semibold mb-4">간편결제 카드 선택</h2>

      <div class="flex overflow-x-auto gap-4 pb-4 scroll-container">
        <!-- 등록된 카드들 -->
        <div
          v-for="card in cards"
          :key="card.id"
          class="shrink-0 snap-start w-[75vw] max-w-sm"
        >
          <div class="w-full aspect-[5/3] relative">
            <div
              class="absolute inset-0 bg-gray-50 rounded-xl shadow-md p-4 flex flex-col justify-between cursor-pointer"
              @click="selectCard(card)"
            >
              <TrashIcon
                class="w-8 h-8 text-blue-400 hover:text-red-500 absolute top-2 right-2 z-10 cursor-pointer"
                @click.stop="confirmDelete(card.id)"
              />
              <p class="font-medium">{{ card.cardName }}</p>
              <p class="text-sm text-gray-500">**** **** **** {{ card.cardNoSuffix }}</p>
            </div>
          </div>
        </div>

        <!-- 카드 등록 버튼 -->
        <div class="shrink-0 snap-start w-[75vw] max-w-sm">
          <div
            class="w-full aspect-[5/3] border-2 border-dashed rounded-xl flex items-center justify-center text-gray-500 text-lg font-medium cursor-pointer"
            @click="viewState = 'register'"
          >
            + 카드 등록하기
          </div>
        </div>
      </div>

      <!-- 하단 취소 버튼 -->
      <div class="mt-6">
        <button
          @click="emit('close')"
          class="w-full py-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
          type="button"
        >
          취소
        </button>
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
  import { nextTick, ref } from 'vue'
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
import { deleteCardFromProfile } from '@/services/payment/deleteCardFromProfileService'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { approveCardPayment } from '~/services/payment/approveCardPaymentService'
import { useCartStore } from '@/stores/cart/useCartStore'

import { useRouter, useRoute } from 'vue-router'
import type { CustomerCompanyActivity } from '~/shared-types/customer-company-activity/customerCompanyActivity'
import { createSubcollectionService } from '~/services/common/subcollectionService'

const router = useRouter()
const route = useRoute()

  const companyStore = useCompanyStore()
  const props = defineProps<{ orderId: string; amount: number; clientId: string }>()
  const emit = defineEmits(['close'])
  
  const viewState = ref<'list' | 'register' | 'pw1' | 'pw2' | 'password'>('list')

  const cards = ref<ProfileCardInfo[]>([])
  const bids = ref<CardBidInfo[]>([])
  let profile = useUserAuthStore().customerProfile
  let profile2 = useUserAuthStore().customerCompanyActivity
  if (profile?.cards) {
    cards.value = Object.values(profile.cards) as ProfileCardInfo[]
  }

  if (profile2?.bids) {

    bids.value = Object.values(profile2.bids) as CardBidInfo[]
  }

  const selectedCard = ref<ProfileCardInfo | null>(null)
  const firstPassword = ref('')
  const savedCardInfo = ref<ProfileCardInfo | null>(null)
  const savedBid = ref<CardBidInfo | null>(null)


  async function confirmDelete(cardId: string) {
  const confirmed = confirm('카드를 삭제하시겠습니까?')
  if (!confirmed) return

  const res = await deleteCardFromProfile(cardId)
  if (res.isSuccess) {
    // cards.value = cards.value.filter(c => c.id !== cardId)
    await refreshCardData()    

  } else {
    alert('카드 삭제에 실패했습니다.\n' + res.message)
  }
}

async function refreshCardData() {
  if(!useUserAuthStore().currentUser || !companyStore.currentCompanyId){
    alert('로그인 정보가 없습니다.')
    return
  }
  const uid = useUserAuthStore().currentUser!.uid
  const companyId = companyStore.currentCompanyId!
  await useUserAuthStore().syncCustomerProfile()
  const service = createSubcollectionService<CustomerCompanyActivity>(
      'v2_companies',
      companyId,
      'v2_users',
      'guest'
    )
  const customerCompany = await service.getOne(uid)
  console.log('회사 내 유저 정보:', customerCompany)
  useUserAuthStore().customerCompanyActivity = customerCompany.data as CustomerCompanyActivity
  profile = useUserAuthStore().customerProfile
  profile2 = useUserAuthStore().customerCompanyActivity
  cards.value = Object.values(profile?.cards || {})
  bids.value = Object.values(profile2?.bids || {})
}

  
  function selectCard(card: ProfileCardInfo) {
    selectedCard.value = card
    viewState.value = 'password'
  }
  
  async function onPasswordEntered(pw: string) {
    if (!selectedCard.value) return
    
    const inputHash = hashString(pw)

    if (inputHash !== selectedCard.value.password) {
    alert('비밀번호가 일치하지 않습니다.')
    viewState.value = 'password' // 현재 그대로지만 입력 초기화를 위해 아래 emit 사용
    // PasswordPad 컴포넌트 내부의 `password`를 초기화하려면 재마운트 유도
    viewState.value = 'list' // 👈 임시로 빠졌다가
    nextTick(() => {
      viewState.value = 'password' // 👈 다시 진입 (비밀번호 입력창 리셋)
    })
    return
  }

    const bid = bids.value.find(b => b.id === selectedCard.value!.id)
    if (!bid?.bid) {
      alert('카드 정보가 없습니다.')
      return
    }
    const cartStore = useCartStore()
    const items = cartStore.items
    const productName =
      items.length === 1
        ? items[0].productName
        : `${items[0].productName} 외 ${items.length - 1}건`
    const res = await approveCardPayment(
      companyStore.currentCompanyId!,
      props.orderId,
      bid!.bid,
      props.amount,
      productName
    )

    if (res.isSuccess) {
      emit('close')
      router.push(`/${companyStore.currentCompanyId}/payment/complete?orderId=${props.orderId}`)
    } else {
      alert('결제 실패: ' + res.message)
    }
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
    const res = await saveRegisteredCard(
      companyStore.currentCompanyId!,
      {
        ...savedCardInfo.value!,
        password:   passwordHash,
      },
      {
        ...savedBid.value!
      }
    )
    if(!res.isSuccess) {
      alert('카드 등록에 실패했습니다.' + res.message)
      return
    }
    await refreshCardData()
    


  
    viewState.value = 'list'
  }
  </script>
  

  
  <style scoped>
  .scroll-container {
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  </style>
  