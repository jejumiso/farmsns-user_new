<template>
  <div class="fixed inset-0 bg-white z-50 overflow-y-auto">
    <!-- 상단 헤더 -->
    <header class="flex items-center justify-between p-4 border-b shadow-sm sticky top-0 bg-white z-10">
      <h2 class="text-lg font-semibold">배송지 관리</h2>
      <button @click="close" class="text-2xl text-gray-600">&times;</button>
    </header>

    <!-- 검색 입력 및 찾기 -->
    <div class="p-4">
      <div class="flex gap-2">
        <input
          v-model="searchQuery"
          @focus="isSearching = true"
          type="text"
          placeholder="주소를 입력하세요"
          class="flex-1 px-3 py-2 border rounded-md"
        />
        <button @click="searchAddress" class="px-3 py-2 bg-blue-500 text-white rounded-md">
          🔍
        </button>
      </div>

      <!-- 검색 결과 -->
      <div v-if="isSearching && searchResults.length" class="mt-4 space-y-2">
        <div
          v-for="result in searchResults"
          :key="result.id"
          class="border p-3 rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200"
          @click="selectSearchResult(result)"
        >
          <p>{{ result.label }} - {{ result.address_name }}</p>
        </div>
      </div>

      <!-- 상세 주소 입력 및 등록 -->
      <div v-if="selectedSearchResult" class="mt-4 space-y-2">
        <input
          v-model="detailAddress"
          type="text"
          placeholder="상세 주소 (예: 301호)"
          class="w-full px-3 py-2 border rounded-md"
        />
        <button
          @click="registerAddress"
          class="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          주소 등록
        </button>
      </div>
    </div>

    <!-- 주소 리스트 -->
    <div v-if="!isSearching" class="p-4 space-y-4">
      <div
        v-for="address in addressList"
        :key="address.id"
        class="border p-3 rounded-md flex justify-between items-center cursor-pointer"
        :class="{
          'border-green-500 bg-green-50': selectedAddress?.id === address.id,
          'ring-2 ring-blue-400': address.id === defaultAddressId
        }"
        @click="selectAddress(address)"
      >
        <div>
          <p class="font-medium">{{ address.label }}</p>
          <p class="text-sm text-gray-600">{{ address.address_name }}</p>
          <p v-if="selectedAddress?.id === address.id" class="text-green-600 text-xs mt-1">선택된 배송지</p>
          <p v-if="address.id === defaultAddressId" class="text-blue-600 text-xs mt-1 font-semibold">기본 배송지</p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <button
            v-if="address.id !== defaultAddressId"
            @click.stop="setAsDefault(address.id)"
            class="text-xs text-blue-500 border border-blue-500 px-2 py-1 rounded-md hover:bg-blue-50"
          >
            기본 설정
          </button>
          <span
            v-else
            class="text-xs text-gray-400 border border-gray-300 px-2 py-1 rounded-md cursor-default"
          >
            기본 배송지
          </span>
          <button @click.stop="deleteAddress(address.id)" class="text-red-500 text-lg">🗑</button>
        </div>
      </div>

      <p v-if="addressList.length >= 5" class="text-sm text-red-500 mt-2">
        배송지는 최대 5개까지만 등록할 수 있습니다.
      </p>
    </div>
      <!-- 하단 고정 확인 버튼 -->
  <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-md">
    <button
      @click="handleClose"
      class="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      확인
    </button>
  </div>
  </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore'
import { GeoPoint } from '@/shared/firebase/firebaseTypes'
import type { DeliveryAddress } from '@/shared-types/delivery-address/deliveryAddress'
import geohash from 'ngeohash'
import { onBeforeRouteLeave } from 'vue-router'
const router = useRouter()
const authStore = useUserAuthStore()

const addressList = ref<DeliveryAddress[]>(authStore.customerProfile?.deliveryAddressList || [])
const defaultAddressId = ref(authStore.customerProfile?.defaultDeliveryAddressId ?? null)
const selectedAddress = ref<DeliveryAddress | null>(
  addressList.value.find(a => a.id === defaultAddressId.value) || addressList.value[0] || null
)

const isSearching = ref(false)
const searchQuery = ref('')
const searchResults = ref<DeliveryAddress[]>([])
const selectedSearchResult = ref<DeliveryAddress | null>(null)
const detailAddress = ref('')

function close() {
  router.back()
}

function selectAddress(address: DeliveryAddress) {
  selectedAddress.value = address
}

function setAsDefault(addressId: string) {
  defaultAddressId.value = addressId
  authStore.customerProfile!.defaultDeliveryAddressId = addressId
  // TODO: 서버에도 반영 필요
}

function deleteAddress(addressId: string) {
  addressList.value = addressList.value.filter(addr => addr.id !== addressId)
  if (selectedAddress.value?.id === addressId) {
    selectedAddress.value = addressList.value[0] || null
  }
  if (defaultAddressId.value === addressId) {
    defaultAddressId.value = addressList.value[0]?.id ?? null
    authStore.customerProfile!.defaultDeliveryAddressId = defaultAddressId.value
  }
  // TODO: 서버에도 반영 필요
}

const KAKAOAPIKEY = '93afc1e69ae0f7fec47aa2d7c07f8a40';

async function searchAddress() {
  if (!searchQuery.value.trim()) return

  const query = encodeURIComponent(searchQuery.value.trim())
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${query}`

  const response = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${KAKAOAPIKEY}`, // 또는 환경변수
    },
  })

  const data = await response.json()

  searchResults.value = data.documents.map((doc: any) => ({
    id: doc.address_name,
    label: doc.road_address?.building_name || doc.address_name.split(' ')[0],
    address_name: doc.road_address?.address_name || doc.address_name,
    encryptedDetailAddress: '',
    encryptedRecipientName: '',
    encryptedPhoneNumber: '',
    geoPoint: new GeoPoint(parseFloat(doc.y), parseFloat(doc.x)),
    isDefault: false,
    postCode: doc.road_address?.zone_no || '',
    requestShop: '',
  }))

 
}


function selectSearchResult(result: DeliveryAddress) {
  selectedSearchResult.value = result
  
}

function registerAddress() {
  if (!selectedSearchResult.value || !detailAddress.value) return

  const newAddress: DeliveryAddress = {
    ...selectedSearchResult.value,
    id: `addr_${Date.now()}`,
    label: selectedSearchResult.value.label || '신규',
    encryptedDetailAddress: detailAddress.value,
    encryptedRecipientName: '',
    encryptedPhoneNumber: '',
    isDefault: false,
    requestShop: '',
    geoHash: geohash.encode(selectedSearchResult.value.geoPoint.latitude, selectedSearchResult.value.geoPoint.longitude)
  }


  addressList.value.push(newAddress)
  if(addressList.value.length === 1) {
    defaultAddressId.value = addressList.value[0].id
  } 
  selectedAddress.value = newAddress
  selectedSearchResult.value = null
  detailAddress.value = ''
  isSearching.value = false

  console.log('배송지 검색 추가 후 로그 확인 : ', JSON.stringify(authStore.customerProfile))
  
}



onBeforeRouteLeave((_to, _from, next) => {
  saveToServer()
  next()
})

function handleClose() {
  saveToServer()
  router.back()
}
onMounted(() => {
  console.log('프로필 로그 확인', JSON.stringify(authStore.customerProfile))
})

import { useRoute } from 'vue-router'
import { createCustomerProfileService } from '@/services/customer/customerProfileService'

const route = useRoute()
const companyId = computed(() =>
  route.params.companyId as string || authStore.customerProfile?.companyIds?.[0] || ''
)

let isSaving = false

async function saveToServer() {
  if (isSaving || !authStore.customerProfile) return
  isSaving = true

  // 👉 변경된 addressList를 실제 profile에 반영
  authStore.customerProfile.deliveryAddressList = addressList.value
  authStore.customerProfile.defaultDeliveryAddressId = defaultAddressId.value??''
  alert(JSON.stringify(authStore.customerProfile.deliveryAddressList))

  const res = await createCustomerProfileService('guest').saveItem('',authStore.customerProfile)
  if (res.isSuccess) {
    console.log('✅ 저장 성공')
  } else {
    console.error('❌ 저장 실패', res.message)
  }

  isSaving = false
}

</script>

<style scoped>
/* 추가적인 스타일이 필요하면 여기에 작성하세요 */
</style>