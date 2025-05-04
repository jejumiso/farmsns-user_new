<!-- 📁 pages/[companyId]/mypage/index.vue -->
<template>
  <div class="p-6 max-w-md mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-center text-gray-800">🙋 마이페이지</h1>

    <div class="bg-white rounded-xl shadow-md p-6 space-y-3 text-sm text-gray-700">
      <div class="flex justify-between">
        <span class="font-medium text-gray-600">👤 이름</span>
        <span>{{ authStore.customerName || '알 수 없음' }}</span>
      </div>

      <div class="flex justify-between">
        <span class="font-medium text-gray-600">📞 전화번호</span>
        <span>010-{{ phoneNumber }}</span>
      </div>

      <div class="flex justify-between">
        <span class="font-medium text-gray-600">📦 총 주문 수</span>
        <span>{{ authStore.customerProfile?.orderTotalCount ?? 0 }}건</span>
      </div>

      <div class="flex justify-between">
        <span class="font-medium text-gray-600">🌟 등급</span>
        <span>{{ authStore.customerProfile?.customerRating || '없음' }}</span>
      </div>

      <hr />

      <div class="flex justify-between font-semibold text-base">
        <span>💰 보유 머니</span>
        <span class="text-green-600">{{ authStore.customerCompanyActivity?.pointRemaining ?? 0 }}P</span>
      </div>

      <div class="flex justify-between font-semibold text-base">
        <span>🎯 보유 스탬프</span>
        <span class="text-blue-600">{{ authStore.customerCompanyActivity?.stampRemaining ?? 0 }}개</span>
      </div>

      <div class="flex justify-between font-semibold text-base">
      <!-- 🎟️ 보유 쿠폰 -->
      <button
        @click="goToCouponPage"
        class="flex justify-between items-center w-full font-semibold text-base text-purple-600 hover:bg-purple-50 rounded-md px-2 py-1 transition"
      >
        <span>🎟️ 보유 쿠폰</span>
        <span>{{ couponStore.coupons.length ?? 0 }}장</span>
      </button>

      </div>
    </div>

    <div class="text-center">
      <button
        class="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition"
        @click="handleLogout"
      >
        로그아웃
      </button>
    </div>
  </div>
</template>



<script setup lang="ts">
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import { useRoute, useRouter } from 'vue-router'
import { decryptWithIv } from '@/shared-utils/crypto/decryption';
import { computed, onMounted, ref, watch } from 'vue';
import { useCouponStore } from '~/stores/coupon/useCouponStore';

const authStore = useUserAuthStore()
const router = useRouter()
const couponStore = useCouponStore()


const route = useRoute()
const companyId = computed(() => route.params.companyId as string)

const goToCouponPage = () => {
  router.push(`/${companyId.value}/mypage/coupons`)
}



const profile = computed(() => authStore.customerProfile) // ✅ 변경


const phoneNumber = ref<string>('복호화 전')


watch(
  () => profile.value?.contactInfo?.securedPhoneMain,
  (encrypted) => {
    const iv = profile.value?.iv
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

