<template>
    <div class="relative w-full overflow-hidden">
      <div
        class="flex transition-transform ease-in-out duration-300"
        :style="`transform: translateX(-${currentIndex * (cardWidth + gap)}px)`"
        ref="sliderRef"
      >
        <div
          v-for="(card, index) in cardsWithAdd"
          :key="card.id || 'add-card'"
          :class="['shrink-0', 'rounded-xl', 'shadow-md', 'bg-white', 'p-4', 'mr-4', { 'border-2 border-green-500': index === currentIndex }]"
          :style="`width: ${cardWidth}px`"
          @click="handleCardClick(index, card)"
        >
          <div v-if="card.type === 'card'">
            <p class="font-bold text-lg">{{ card.cardName }}</p>
            <p class="text-sm text-gray-500">**** **** **** {{ card.last4 }}</p>
            <button class="mt-2 text-red-500 text-sm underline" @click.stop="deleteCard(card)">삭제</button>
          </div>
  
          <div v-else class="flex flex-col justify-center items-center h-full text-center">
            <p class="text-xl">➕</p>
            <p class="text-sm">카드 등록하기</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  
  type CardItem = {
    id: string
    type: 'card'
    cardName: string
    last4: string
  } | {
    id: null
    type: 'add'
  }
  
  const props = defineProps<{
    cards: CardItem[]
  }>()
  
  const emit = defineEmits<{
    (e: 'select', card: CardItem): void
    (e: 'add'): void
    (e: 'delete', card: CardItem): void
  }>()
  
  const cardWidth = 280
  const gap = 16
  const currentIndex = ref(0)
  const sliderRef = ref<HTMLElement | null>(null)
  
  const cardsWithAdd = computed(() => [
    ...props.cards,
    { id: null, type: 'add' } as CardItem
  ])
  
  function handleCardClick(index: number, card: CardItem) {
    currentIndex.value = index
    if (card.type === 'add') emit('add')
    else emit('select', card)
  }
  
  function deleteCard(card: CardItem) {
    emit('delete', card)
  }
  </script>
  
  <style scoped>
  .relative {
    padding-bottom: 20px;
  }
  </style>
  