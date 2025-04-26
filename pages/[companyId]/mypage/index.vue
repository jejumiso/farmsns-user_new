<script setup lang="ts">
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import { useRouter } from 'vue-router'
import { decryptWithIv } from '@/shared-utils/crypto/decryption';
import { onMounted, ref, watch } from 'vue';

const authStore = useUserAuthStore()
const router = useRouter()




const profile   = authStore.customerProfile

const phoneNumber = ref<string>('복호화 전')

watch(
  () => profile?.contactInfo?.securedPhoneMain,
  (encrypted) => {
    const iv = profile?.iv
    if (encrypted && iv) {

      phoneNumber.value = decryptWithIv(encrypted, iv) || '복호화 실패'
    }
  },
  { immediate: true }
)



const handleLogout = async () => {
  authStore.logout()
  router.replace('/') // 로그아웃 후 홈 또는 로그인 페이지로 이동
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto space-y-4">
    <h1 class="text-xl font-bold text-center">마이페이지</h1>
    <div class="bg-white rounded-xl shadow p-4">
      <p><strong>이름:</strong> {{ authStore.customerName || '알 수 없음' }}</p>
      <p><strong>전화번호:</strong> 010-{{ phoneNumber }}</p>
      <p><strong>총 주문 수:</strong> {{ authStore.customerProfile?.orderTotalCount ?? 0 }}</p>
      <p><strong>등급:</strong> {{ authStore.customerProfile?.customerRating || '없음' }}</p>
      <p><strong>보유머니:</strong> {{ authStore.customerCompanyActivity?.pointRemaining || '없음' }}</p>
    </div>

    <div class="text-center">
      <button
        class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl shadow"
        @click="handleLogout"
      >
        로그아웃
      </button>
    </div>
  </div>
</template>
