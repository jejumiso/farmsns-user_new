<template>
  <aside class="w-64 bg-gray-800 text-white flex flex-col">
    <div class="p-4 text-lg font-bold border-b border-gray-700">관리자 메뉴</div>
    <nav class="flex-1">
      <ul>

        
        <li>
          <button
            @click="$emit('navigate', '/admin/invoice')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/invoice' ? 'bg-gray-600' : '']"
          >
            <RocketLaunchIcon class="h-5 w-5 mr-2" />
            송장발송
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', '/admin/invoice2')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/invoice2' ? 'bg-gray-600' : '']"
          >
            <PencilIcon class="h-5 w-5 mr-2" />
            송장발송2
          </button>
        </li>

        
        <li>
          <button
            @click="toggleProductMenu"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', isProductMenuOpen ? 'bg-gray-600' : '']"
          >
            <WrenchIcon class="h-5 w-5 mr-2" />
            상품관리
          </button>
          <ul v-if="isProductMenuOpen" class="pl-6">
            <li>
              <button
                @click="$emit('navigate', '/admin/product')"
                :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700',
         currentPath.startsWith('/admin/product') ? 'bg-gray-600' : '']"
              >
                상품LIST
              </button>
            </li>
            <li>
              <button
                @click="$emit('navigate', '/admin/option')"
                :class="[
  'w-full text-left px-4 py-2 flex items-center hover:bg-gray-700',
  currentPath.startsWith('/admin/option') && !currentPath.startsWith('/admin/option-group') ? 'bg-gray-600' : ''
]"

              >
                옵션LIST
              </button>
            </li>
            <li>
              <button
                @click="$emit('navigate', '/admin/option-group')"
                :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath.startsWith('/admin/option-group') ? 'bg-gray-600' : '']"
              >
                옵션그룹LIST
              </button>
            </li>
            <li>
              <button
                @click="$emit('navigate', '/admin/category')"
                :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath.startsWith('/admin/category') ? 'bg-gray-600' : '']"
              >
                카테고리
              </button>
            </li>
          </ul>
        </li>
        <li v-if="authStore.administrator === null || authStore.currentCompany === null">
          <button
            @click="$emit('navigate', '/admin/join')"
            :class="['w-full text-left px-4 py-2 flex items-center font-bold', currentPath === '/admin/join' ? 'bg-yellow-500 text-black' : 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black']"
          >
            <PencilIcon class="h-5 w-5 mr-2" />
            이용신청
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', '/admin/dashboard')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/dashboard' ? 'bg-gray-600' : '']"
          >
            <HomeIcon class="h-5 w-5 mr-2" />
            홈
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', '/admin/invite')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/invite' ? 'bg-gray-600' : '']"
          >
            <ShareIcon class="h-5 w-5 mr-2" />
            초대
          </button>
        </li>
        <li>
          <button
            @click="$emit('navigate', '/admin/settings')"
            :class="['w-full text-left px-4 py-2 flex items-center hover:bg-gray-700', currentPath === '/admin/settings' ? 'bg-gray-600' : '']"
          >
            <WrenchIcon class="h-5 w-5 mr-2" />
            셋팅
          </button>
        </li>
      </ul>
    </nav>
    <!-- ✅ 상품만 새로 동기화하는 버튼 -->
<button @click="syncProductStore" class="bg-blue-600 text-white px-4 py-2 m-2 rounded hover:bg-blue-700">
  상품 동기화
</button>
    <!-- 임시 저장소 초기화 버튼 -->
<button @click="resetStores" class="reset-button">
  저장소 초기화1
</button>
    <button @click="logout" class="logout-button">
      {{ authStore.currentCompany === null || authStore.currentCompany.shopName === '' ? '관리자' : authStore.currentCompany.shopName  }} &nbsp;
      <PowerIcon class="h-5 w-5 mr-2" />
    </button>

  </aside>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { HomeIcon, PencilIcon, PowerIcon, ShareIcon, RocketLaunchIcon, WrenchIcon } from '@heroicons/vue/24/outline';
import { useUserAuthStore } from '@/stores/userAuth/useUserAuthStore';
import { useProductStore } from '@/stores/product/useProductStore'
import { useCategoryStore } from '@/stores/category/useCategoryStore'
import { useOptionStore } from '@/stores/option/useOptionStore'
import { useOptionGroupStore } from '@/stores/option-group/useOptionGroupStore'

import { clearCompanyCache } from '@/utils/companyCache'

function resetStores() {
  const companyId = useUserAuthStore().currentCompany?.id
  if (!companyId) return

  const productStore = useProductStore()
  productStore.items = []
  productStore.dateLastFetched = 0
  clearCompanyCache('product', companyId)

  const categoryStore = useCategoryStore()
  categoryStore.items = []
  categoryStore.dateLastFetched = 0
  clearCompanyCache('category', companyId)

  const optionStore = useOptionStore()
  optionStore.items = []
  optionStore.dateLastFetched = 0
  clearCompanyCache('option', companyId)

  const optionGroupStore = useOptionGroupStore()
  optionGroupStore.items = []
  optionGroupStore.dateLastFetched = 0
  clearCompanyCache('optionGroup', companyId)

  console.log('🧹 저장소 + 캐시 초기화 완료')
}

async function syncProductStore() {
  const productStore = useProductStore()
  var res = await productStore.syncWithServer()
  if (res.isSuccess) {
    alert('상품 동기화 성공' + JSON.stringify(res.data))
  } else {
    alert('상품 동기화 실패: ' + res.message)
  }
}

const router = useRouter();
const currentPath = ref('');
const isProductMenuOpen = ref(false);

const authStore = useUserAuthStore();

function toggleProductMenu() {
  isProductMenuOpen.value = !isProductMenuOpen.value;
}

async function logout() {
  try {
    await authStore.logout();
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    currentPath.value = newPath;

    isProductMenuOpen.value = [
      '/admin/product',
      '/admin/option',
      '/admin/option-group',
      '/admin/category',
    ].some(path => newPath.startsWith(path))
  },
  { immediate: true }
)
</script>


<style scoped>
.logout-button,
.reset-button,
.bg-blue-600 {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logout-button:hover,
.reset-button:hover,
.bg-blue-600:hover {
  background-color: #1e40af;
}

aside {
  background-color: #1f2937; /* gray-800 */
  color: white;
  width: 260px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #374151; /* gray-700 */
}

aside .font-bold {
  color: #f9fafb;
}

nav ul li button {
  border-radius: 6px;
  transition: background-color 0.2s ease;
  font-size: 0.95rem;
}

nav ul li button:hover {
  background-color: #374151; /* gray-700 */
}

.bg-gray-600 {
  background-color: #4b5563 !important;
}

.bg-yellow-500 {
  background-color: #facc15 !important;
  color: black !important;
}

.border-yellow-500 {
  border-color: #facc15 !important;
}
</style>
