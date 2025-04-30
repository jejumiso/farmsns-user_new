<!-- 📁 components/payment/CardSlider.vue -->
<template>
  <div class="relative w-full overflow-x-auto px-4 py-6 scroll-container">
    <div class="flex gap-4 w-max snap-x snap-mandatory">
      <!-- 카드 리스트 -->
      <div
        v-for="card in savedCards"
        :key="card.bid"
        class="w-[80vw] shrink-0 snap-start bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between"
      >
        <div class="text-sm text-gray-500 mb-2">{{ card.cardName }}</div>
        <div class="text-xl font-bold">**** **** **** {{ card.cardNum.slice(-4) }}</div>
        <button
          class="mt-6 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          @click="$emit('pay', card)"
        >
          이 카드로 결제하기
        </button>
      </div>

      <!-- 카드 등록 카드 -->
      <div
        class="w-[80vw] shrink-0 snap-start bg-gray-100 rounded-2xl border-dashed border-2 border-gray-300 flex items-center justify-center text-gray-500 text-lg font-medium cursor-pointer"
        @click="$emit('register')"
      >
        + 새 카드 등록하기
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  savedCards: Array<{
    bid: string
    cardName: string
    cardNum: string
  }>
}>()
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
